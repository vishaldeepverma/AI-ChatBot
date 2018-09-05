const functions = require('firebase-functions');
const admin = require('firebase-admin');
var nodemailer = require('nodemailer');
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

exports.createUser = functions.firestore.document('zorang/{userId}').onCreate((snap, context) => {
      console.log(context.params.userId);
      email=context.params.userId;
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
               user: 'vishal.verma@zorang.com',
               pass: '******'
           }
       });
    
      const mailOptions = {
      from: '"Zora" <sales@zorang.com>', // sender address
      to: email, // list of receivers
      subject: 'Welcome to Zorang', // Subject line
      html: '<img src="https://drive.google.com/file/d/10UuJreaxs1HsojyutEcyfho6l_tuljoS/view"><h1>Welcome To Zorang</h1><br><h3>Thanks for visiting us!</h3>'// plain text body
      };
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          console.log(err)
        else
          console.log(info);
          
     });
     return null;
    });

exports.dialogflow = functions.https.onRequest((request, response) => {

var intent_name=request.body.queryResult.intent.displayName;
var params=request.body.queryResult.parameters;
var name='User';
var email='default_email';
var desc;
var index;
var phoneNumber;
var context_array=request.body.queryResult.outputContexts;
    
    context_array.forEach(arrayItem =>{
    name=arrayItem.name;
    var pageURL = arrayItem.name;
    var lastURLSegment = pageURL.substr(pageURL.lastIndexOf('/') + 1);
    
    if(lastURLSegment==='username'){
      index=context_array.indexOf(arrayItem);
      }
    });


switch (intent_name) {
    case 'Default-Welcome-Intent - givenEmail':
    console.log('Default-Welcome-Intent - givenEmail');
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log('email is '+email);
    var userRef = db.collection('zorang').doc(email);
    var profilePromise = userRef.get().then(doc => {
        if (doc.exists) {
          var profile = doc.data()
          profile.id = doc.id
          response.send({
            //fulfillmentText:`Hello! ${profile.name} How can i help you?`
            fulfillmentText:`Please provide me your name`
        });
          return profile 
    
        } else {
          email=request.body.queryResult.outputContexts[index].parameters.email;
          var f = db.collection('zorang').doc(email);
          var p = f.set({
            email: email
          
          });
          response.send({
            fulfillmentText:'Your email is '+'<a>'+email+'</a>'+' Please provide me your name.'
          });
          return null;
          //throw new Error("Profile doesn't exist")
        }
      })
      break; 

     case 'zorang.book-demo - yes - yes' :
     console.log('zorang.book-demo - yes - yes');
     desc=request.body.queryResult.outputContexts[index].parameters.description;
     email=request.body.queryResult.outputContexts[index].parameters.email;
     name=request.body.queryResult.outputContexts[index].parameters.name;
     console.log('the email is '+email); 
     if (email==='a@a.com'){
      response.send({
        fulfillmentText:"Please provide your email id"
      });
    }
    else{
       var docRefa = db.collection('zorang').doc(email);
       var setAdaa = docRefa.update({
         desc: desc
         
       });
       response.send({
         fulfillmentText:'Your demo is booked successfully. We will contact you soon!`'
       });
    }
    break;
    
    case 'zorang.book-demo - yes - yes - custom':
     console.log('zorang.book-demo - yes - yes - custom');
     email=request.body.queryResult.outputContexts[index].parameters.email;
     var u = db.collection('zorang').doc(email);
     
     desc=request.body.queryResult.outputContexts[index].parameters.description;
     var p = u.get().then(doc => {
        if (doc.exists) {
          var setAdaee = u.update({  
            desc:desc
             });
          response.send({
            fulfillmentText:`Your demo is booked successfully. We will contact you soon!`
        });
          return null; 
    
        } else {
          var s = u.set({  
            email:email,
            desc:desc
             });
          response.send({
            fulfillmentText:`Your demo is booked successfully. We will contact you soon!`
          });
          return null;
          //throw new Error("Profile doesn't exist")
        }
      })
      break; 

    case 'zorang.contact-me':
 
    email=request.body.queryResult.outputContexts[index].parameters.email;
    var phone=`${params.number}`;

    if(email==='a@a.com'){
      console.log('not found');
    }
    else{
      
      var d = db.collection('zorang').doc();
    var s = d.set({
    contactme: phone,
    mail_me:email
});
response.send({
  fulfillmentText:'Alight! We will contact you soon.'
});
    }
    
    break;

    case 'zorang.username-input':
    console.log('zorang.username-input');

    email=request.body.queryResult.outputContexts[index].parameters.email;
    name=request.body.queryResult.outputContexts[index].parameters.name[0];
    console.log('The email is: '+email);
    console.log('The name is:'+name);
    c = db.collection('zorang').doc(email);
    v1 = c.get().then(doc => {
        if (doc.exists) {
            v1 = c.update({  
            name:name
            });
            response.send({
              fulfillmentText:'Hey! '+name+' How can i help you?'
            });   
          return null;
        } else {
          response.send({
            fulfillmentText:'Hey! '+name+' How can i help you?'
          });
          return null;
        }
        });
     

    break;
    
    case 'zorang.cloud-Integration':
    console.log('zorang.cloud-Integration');
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log(email+'is this---------------');
    if (email==='email'){
      response.send({
        fulfillmentText:'We have extensive experience in IBM AppConnect and have built sophisticated real-time, near real-time and batch integration use cases, connecting applications such as Salesforce in the cloud to on-premise legacy applications such as SAP etc.<a href="mailto:sales@zorang.com" style="color:red"> For any further info please provide me your email Id.</a>'
      });
    }
    else{
      response.send({
        fulfillmentText:'We have extensive experience in IBM AppConnect and have built sophisticated real-time, near real-time and batch integration use cases, connecting applications such as Salesforce in the cloud to on-premise legacy applications such as SAP etc.'
      });
    }
    break;
    
    case 'zorang.cloud-Integration - email':
    console.log('zorang.cloud-Integration - email');
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log('zorang.cloud-Integration - email------------------- '+email);
    c = db.collection('zorang').doc(email);
    v1 = c.get().then(doc => {
        if (doc.exists) {
            v1 = c.update({  
            query:'zorang.cloud-Integration'
            });
          response.send({
            fulfillmentText:'We will contact you soon!'
          });   
          return null;
        } else {
          email=request.body.queryResult.outputContexts[index].parameters.email;
            v1 = c.set({  
            email:email,
            query:'zorang.cloud-Integration'
            
             });
          response.send({
            fulfillmentText:'We will contact you soon!'
          });
          return null;
         
        }
      })
    
    break;

    case 'zorang.data-Integration':
    console.log('zorang.data-Integration');
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log(email+'is this---------------');
    
    if (email==='a@a.com'){
      response.send({
        fulfillmentText:'Yes, we have extensive experience in Cloud Integration, Enterprise Application Integration, APIs, Micro-services architecture etc. We are also implementation partners of IBM and Jitterbit and also have experience with Dell Boomi among others.<a href="mailto:sales@zorang.com" style="color:red">Please provide your email id for more details<a/>'
      }); 
    }
    else{
      response.send({
        fulfillmentText:'Yes, we have extensive experience in Cloud Integration, Enterprise Application Integration, APIs, Micro-services architecture etc. We are also implementation partners of IBM and Jitterbit and also have experience with Dell Boomi among others.'
      });
    }
    break;

    case 'zorang.data-Integration - email':
    console.log('zorang.data-Integration - email');
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log('zorang.data-Integration - email------------------- '+email);
    c = db.collection('zorang').doc(email);
    v1 = c.get().then(doc => {
        if (doc.exists) {
            v1 = c.update({  
            query:'zorang.data-Integration'
            });
          response.send({
            fulfillmentText:'We will contact you soon!'
          });   
          return null;
        } else {
          email=request.body.queryResult.outputContexts[index].parameters.email;
            v1 = c.set({  
            email:email,
            
            query:'zorang.data-Integration'
            
             });
          response.send({
            fulfillmentText:'We will contact you soon!'
          });
          return null;
         
        }
      })
    break;

    case 'zorang.pricing':
    console.log('pricing started');
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log(email+'is the email');
    if (email==='a@a.com'){
        response.send({
            fulfillmentText:'Our quotes depend upon your business requirements and we will be glad to work with you to understand the same and provide a competitive and compelling business proposition. Provide your email id'
          });
   }
    else{
      response.send({
        fulfillmentText:'Our quotes depend upon your business requirements and we will be glad to work with you to understand the same and provide a competitive and compelling business proposition.'
      });
    }

    break;

    case 'zorang.pricing - email':
    
    console.log('zorang.pricing - email');
    phoneNumber=request.body.queryResult.outputContexts[index].parameters.phoneNumber;
      
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log('zorang.pricing - email------------------- '+email);
    console.log('phone number is: '+phoneNumber);

    var q = db.collection('zorang').doc(email);
    var w = q.get().then(doc => {
        if (doc.exists) {
            v1 = q.update({  
            query:'about pricing'
            });
          if(phoneNumber==='')
          {
            response.send({
              fulfillmentText:'Please provide me contact number'
            });
          }
          else{
            response.send({
              fulfillmentText:'We will contact you soon'
            });
          }   
          return null;
        } else {
          email=request.body.queryResult.outputContexts[index].parameters.email;
            w = q.set({  
            email:email,
            
            query:'about pricing'
            
             });
             if(phoneNumber==='')
             {
               response.send({
                 fulfillmentText:'Please provide me contact number'
               });
             }
             else{
              response.send({
                fulfillmentText:'We will contact you soon'
              });
            }    
          return null;
         
        }
      })
    
    break;
    
    case 'zorang.whatIsMyName':
    name=request.body.queryResult.outputContexts[index].parameters.name;
    response.send({
      fulfillmentText:`Hey! I remember your name. You are `+name+` right?`
    });
    break;

    case 'zorang.business-Analysis':
    console.log('zorang.business-Analysis');
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log(email+'is this---------------');
    if (email==='a@a.com'){
        response.send({
            fulfillmentText:'Business Analysis and Strategy is our core competency and we are helping our customers maximize their IT budgets by prioritizing projects that will achieve the biggest ROI.Please provide your email Id for more details.'
          });
    }
    else{
      response.send({
        fulfillmentText:'Business Analysis and Strategy is our core competency and we are helping our customers maximize their IT budgets by prioritizing projects that will achieve the biggest ROI. Please provide your contact number'
      });
    }
     
    break;

    case 'zorang.business-Analysis - email':
    console.log('zorang.business-Analysis - email');
    phoneNumber=request.body.queryResult.outputContexts[index].parameters.phoneNumber;
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log('zorang.business-Analysis - email '+email);
    console.log('The phone number is: '+phoneNumber);
    c = db.collection('zorang').doc(email);
    v1 = c.get().then(doc => {
        if (doc.exists) {
            v1 = c.update({  
            query:'about business analysis'
            });

          if(phoneNumber==='')
          {
            response.send({
              fulfillmentText:'Please provide me contact number'
            });
          }
          else{
            response.send({
              fulfillmentText:'We will contact you soon'
            });
          }     
          return null;
        } else {
          email=request.body.queryResult.outputContexts[index].parameters.email;
            v1 = c.set({  
            email:email,
            
            query:'about business analysis'
            
             });
             if(phoneNumber==='')
             {
               response.send({
                 fulfillmentText:'Please provide me contact number'
               });
             }
             else{
              response.send({
                fulfillmentText:'We will contact you soon'
              });
            }   
          return null;
         
        }
      })
    break;

    case 'zorang.businessStrategy':
    console.log('zorang.businessStrategy');
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log(email+'is this---------------');
    if(email===''){
        response.send({
          fulfillmentText:'We work with our customers on Digital Business Strategy and help them identify and deploy solutions which help them maximize their ROI and improve efficiencies. If you would like more information I can schedule a call for you. Please provide your email Id for more info.'
        });
    }
    else{
        response.send({
        fulfillmentText:'We work with our customers on Digital Business Strategy and help them identify and deploy solutions which help them maximize their ROI and improve efficiencies. If you would like more information I can schedule a call for you.'
      });
    }
    break;

    case 'zorang.businessStrategy - email':
    console.log('zorang.businessStrategy - email');
    email=request.body.queryResult.outputContexts[index].parameters.email;
    phoneNumber=request.body.queryResult.outputContexts[index].parameters.phoneNumber;
    console.log('zorang.businessStrategy - email - email '+email);
    console.log('The phone number is: '+phoneNumber);
    c = db.collection('zorang').doc(email);
    v1 = c.get().then(doc => {
        if (doc.exists) {
            v1 = c.update({  
            query:'businessStrategy'
            });
            if(phoneNumber==='')
            {
              response.send({
                fulfillmentText:'Please provide me contact number'
              });
            }
            else{
              response.send({
                fulfillmentText:'We will contact you soon'
              });
            }       
          return null;
        } else {
          email=request.body.queryResult.outputContexts[index].parameters.email;
            v1 = c.set({  
            email:email,
            
            query:'businessStrategy'
            
             });
             if(phoneNumber==='')
             {
               response.send({
                 fulfillmentText:'Please provide me contact number'
               });
             }
             else{
              response.send({
                fulfillmentText:'We will contact you soon'
              });
            }   
          return null;
         
        }
      })
    break;

    case 'zorang.askForPhoneNumber':
    console.log('zorang.askForPhoneNumber');
    phoneNumber=request.body.queryResult.outputContexts[index].parameters.phoneNumber;
    email=request.body.queryResult.outputContexts[index].parameters.email;
    console.log('Phone number is: '+phoneNumber);
    console.log('The email is:'+email);
    var b = db.collection('zorang').doc(email);
    var lk = b.update({
    Phone_Number: phoneNumber,
    query:`about pricing`
    });
    response.send({
      fulfillmentText:'We will contact you soon!'
    });
    break;

    default: 
        response.send({
            fulfillmentText:"This is webhook. Something went wrong"
    });
}
});  