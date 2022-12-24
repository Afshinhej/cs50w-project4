document.addEventListener('DOMContentLoaded', function() {

    // defualt view
    load_page('allposts-view')

    // loading a page
    document.querySelector('#allposts-link').onclick = () => load_page('allposts-view');
    if (document.querySelector('#following-link')) {
        document.querySelector('#following-link').onclick = () => load_page('following-view');
    }
    if (document.querySelector('#profile-link')) {
        document.querySelector('#profile-link').onclick = () => load_page('profile-view');
    }
    
    document.querySelector('#network-link').onclick = () => load_page('network-view');

    // showing previous posts 
    showing_posts();

    // Submitting a new post
    if (document.querySelector('#compose-post')) {

        document.querySelector('#compose-post').onsubmit = () => {
        post_body = document.querySelector("#compose-body").value;     
        submit_post(post_body, this.location.reload);
        document.querySelector('#compose-body').value = '';
        
        // stop form from submitting
        return false;
        };

    // showing user's page
    document.querySelectorAll('.users').forEach((user) => {
        user.onclick = () => {

            profileLoading(user.dataset.userid);         

        }
    })
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
            const likes = document.createElement('text');

            head.innerHTML = element.user;
            text.innerHTML = element.body;
            time.innerHTML = element.timestamp;
            likes.innerHTML = element.likes;

            div.classList.add("border", "rounded", "border-5", "shadow-lg", "p-3", "mb-5", "bg-body")
            div.append(head, text, hr, time, `|❤️`, likes);
            document.querySelector('#previousposts').append(div);
        });
    });
};


// a function for submitting a post 
function submit_post(post_body, myCallback) {

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
    myCallback();
};

// loading page
function load_page(page) {
    if (page === 'profile-view') {

        // Show the all-posts view and hide other views
        user_id = document.querySelector('#profile-link').dataset.userid;
        profileLoading(user_id);
        
    } else if (page === 'allposts-view') {
        
        // Show the all-posts view and hide other views
        document.querySelector('#allposts-view').style.display = 'block';
        document.querySelector('#network-view').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'none';
        document.querySelector('#page-title').innerHTML = 'All Posts';  
        
    } else if (page === 'following-view') {
        
        // Show the following view and hide other views
        document.querySelector('#allposts-view').style.display = 'block';
        document.querySelector('#network-view').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'none';
        document.querySelector('#page-title').innerHTML = 'Posts from Followed Users';

    } else if (page === 'network-view') {

        // Show the network view and hide other views
        document.querySelector('#allposts-view').style.display = 'none';
        document.querySelector('#network-view').style.display = 'block';
        document.querySelector('#profile-view').style.display = 'none'; 

    }

};

// loading profile page
function profileLoading(user_id) {
    document.querySelector('#allposts-view').style.display = 'none';
    document.querySelector('#network-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'block';

    fetch(`/profile/${user_id}`)
    .then(response => response.json())
    .then(data => {

        document.querySelector('#profile-title').innerHTML = data[0].username;

    })
};