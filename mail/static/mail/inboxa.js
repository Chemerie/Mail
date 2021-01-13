document.addEventListener('DOMContentLoaded', function() {

  document.querySelector('#inbox').addEventListener('click', () =>load_mailbox('inbox'));
  // Use buttons to toggle between views
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  //When a user submits a composed mail
  document.querySelector("#compose-form").onsubmit = function(){
    // get the values input by the user
    const recipients = document.querySelector("#compose-recipients").value;
    const subject = document.querySelector("#compose-subject").value;
    const body = document.querySelector("#compose-body").value;
    // console.log("Hello");
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
      })
    })
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
    load_mailbox('sent');
    return false;
    
  }
// var ida = document.querySelector("#hiden").value;
// const arch_button = document.querySelector("#buttoner");
// arch_button.onclick = ()=>{
//     fetch("emails/ida", {
//         method: "PUT",
//         body: JSON.stringify({
//         archieve: true
//       })
//     })
//   load_mailbox('archive');
//   console.log(ida);
//   }
});
  



function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#single-mail').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}



function load_mailbox(mailbox) { // Well i decided to do everything with only this one fuction
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-mail').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  


  //Get the required mailbox information ( a list )
  fetch(`emails/${mailbox}`)
  .then(response => response.json())
  .then(emails =>{
    console.log(emails)

    //For each mail in the returned mailbox
    emails.forEach(email=>{
      //Create the required divs  to display the email
      const div1 = document.createElement("div");
      const div2 = document.createElement("div");
      const div3 = document.createElement("div");
      const div4 = document.createElement("div");
      const div5 = document.createElement("div");

      //Insert divs into dives to achieve the required display
      div1.style.cssText = "display: flex; margin-bottom: 10px; width: 60vw;justify-content: space-between; border: 1px solid #ddd; height: 40px";
      div1.append(div2, div3);
      div2.style.cssText = "display: flex; width: 40vw;justify-content: space-between; height: 40px; padding-top:10px;";
      div2.append(div4, div5)
      div3.style.cssText = "height: 40px; padding-top:10px";
    
      // Get the values from the mail
      const recipients = email.recipients;
      const sender = email.sender;
      const subject = email.subject;
      const body = email.body;
      const time_stamp = email.timestamp;
      const id = email.id;

      // If the reuturned mailbox is inbox (Click the inbox button)
      if (`${mailbox}` === "inbox"){

        //pass values to the divs
        div4.innerHTML = `<strong>${sender}</strong>`;
        div5.innerHTML = `<strong>${subject}</strong>`;
        div3.innerHTML = `<strong>${time_stamp}</strong>`;
        
        //turns the background to grey when the mail is read
        if (email.read){
          div1.style.background = "#ddd";
        }
        //Append the main div to html
        document.querySelector("#emails-view").append(div1);

        //click on the single mail from the inbox
        div1.onclick = ()=>{
          //disable other divs except the single- mail div
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#single-mail').style.display = 'block';

          //Enable the buttons
          var replya = document.querySelector("#replyer");
          replya.innerHTML = "Reply";
          replya.style.cssText = "display: block;";
          document.querySelector("#buttoner").style.cssText = "display: block; margin-left: 40px;";

          //Append values to the element componemts of the div
          document.querySelector("#fromer").innerHTML = sender;
          document.querySelector("#toer").innerHTML = recipients;
          document.querySelector("#subjecter").innerHTML = subject;
          document.querySelector("#timestamper").innerHTML = time_stamp;
          document.querySelector("#bodyer").innerHTML = body;
          
          //mark the clicked mail as read
          fetch(`emails/${id}`, {
            method: "PUT",
            body: JSON.stringify({
              read: true
            })
          })

        }

      // when a user achives a mail by pressing the achive button
      const arch_button = document.querySelector("#buttoner");
      arch_button.onclick = ()=>{
        fetch(`emails/${id}`, {
          method: "PUT",
          body: JSON.stringify({
          archived: true
        })
      })
      load_mailbox('inbox');

      }

      //When a user clicks on the reply button
      const reply_button = document.querySelector("#replyer");
      reply_button. onclick = ()=>{


          //Get the initial values of the div block before disabling it
          var sendera = document.querySelector("#fromer").innerHTML;
          var recipientsa =  document.querySelector("#toer").innerHTML;
          var subjecta = document.querySelector("#subjecter").innerHTML;
          var timestampa =  document.querySelector("#timestamper").innerHTML;
          var bodya =  document.querySelector("#bodyer").innerHTML;
    
          //display the compse block and disable other blocks
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'block';
          document.querySelector('#single-mail').style.display = 'none';



          //Prefill the elemets with values
          document.querySelector('#compose-sender').value = recipientsa;
          document.querySelector('#compose-recipients').value = sendera;
          //Check whether the subject already has RE:
          var firstword = subjecta.replace(/ .*/, '');
          if (firstword.toUpperCase === 'RE:'){
            document.querySelector('#compose-subject').value = `${subjecta}`;
          }else{
            document.querySelector('#compose-subject').value = `Re: ${subjecta}`;
          }   
          document.querySelector('#compose-body').value = `On ${timestampa}, ${sendera} wrote: ${bodya}`;

      }

      // If the reuturned mailbox is sent (Click the sent button)
      }else if(`${mailbox}` === "sent"){
        //pass values to the divs
        div4.innerHTML = `<strong>To:${recipients}</strong>`;
        div5.innerHTML = `<strong>${subject}</strong>`;
        div3.innerHTML = `<strong>${time_stamp}</strong>`;
        document.querySelector("#emails-view").append(div1);

        //click on the single mail from the sent
        div1.onclick = ()=>{
          //disable other divs except the single- mail div
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#single-mail').style.display = 'block';

          //Disable the buttons
          document.querySelector("#replyer").style.cssText = "display: none;";
          document.querySelector("#buttoner").style.cssText = "display: none;";
          //Append values to the element componemts of the div
          document.querySelector("#fromer").innerHTML = sender;
          document.querySelector("#toer").innerHTML = recipients;
          document.querySelector("#subjecter").innerHTML = subject;
          document.querySelector("#timestamper").innerHTML = time_stamp;
          document.querySelector("#bodyer").innerHTML = body;


        }

        // If the reuturned mailbox is archive (Click the archive button)
       }else{
        //Check whether the returned mail is achived
        if (email.archived){
          //pass values to the divs
          div4.innerHTML = `<strong>${sender}</strong>`;
          div5.innerHTML = `<strong>${subject}</strong>`;
          div3.innerHTML = `<strong>${time_stamp}</strong>`;
          document.querySelector("#emails-view").append(div1);

          //click on the single mail from the archive mailbox
           div1.onclick = ()=>{
          //disable othe divs except the single- mail div
          document.querySelector('#emails-view').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'none';
          document.querySelector('#single-mail').style.display = 'block';



          //Enable the reply button and rename it to Unarchive
          var unarchive = document.querySelector("#replyer");
          unarchive.style.cssText = "display: block;";
          unarchive.innerHTML = "Unarchive";
          //Disable the archive button
          document.querySelector("#buttoner").style.cssText = "display: none;";

          //Append values to the element componemts of the div
          document.querySelector("#fromer").innerHTML = sender;
          document.querySelector("#toer").innerHTML = recipients;
          document.querySelector("#subjecter").innerHTML = subject;
          document.querySelector("#timestamper").innerHTML = time_stamp;
          document.querySelector("#bodyer").innerHTML = body;

          //Click the unarchive button to uarchive the mail
          unarchive.onclick = ()=>{
            fetch(`emails/${id}`, {
              method: "PUT",
              body: JSON.stringify({
              archived: false
              })
            })
          load_mailbox('inbox');

          }
        }

        }
       }

    })

  });
}
//Quite a lengthy function