document.addEventListener('DOMContentLoaded', function() {

    // showing previous posts 
    showing_posts();

    // Submitting a new post
    if (document.querySelector('#compose-post')) {

        document.querySelector('#compose-post').onsubmit = () => {
        post_body = document.querySelector("#compose-body").value;     
        submit_post(post_body);
        // stop form from submitting
        return false;
        };

}

});

// a function for showing previous posts 
function showing_posts() {
    
   
    fetch('/posts')
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const div = document.createElement('div');
            const hr = document.createElement('hr')
            const head = document.createElement('h4');
            const text = document.createElement('text');
            const time = document.createElement('time');

            head.innerHTML = element.user;
            text.innerHTML = element.body;
            time.innerHTML = element.timestamp;

            div.classList.add("border", "rounded", "border-5", "shadow-lg", "p-3", "mb-5", "bg-body")
            div.append(head, text, hr, time);
            document.querySelector('#previousposts').append(div);
        });
    });
};


// a function for submitting a post 
function submit_post(post_body) {

    const csrftoken =  document.querySelector("[name='csrfmiddlewaretoken']").value
    
    const data ={
      post_body:`${post_body}`,
    }
    fetch('/post', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'X-CSRFToken': csrftoken},
      mode: 'same-origin'
    })
    .then(response => response.json())
    .then(information => console.log(information));

};