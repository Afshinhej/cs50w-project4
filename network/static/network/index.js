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
    showing_posts('all', '');

    // Submitting a new post
    if (document.querySelector('#compose-post')) {

        document.querySelector('#compose-post').onsubmit = () => {
        post_body = document.querySelector("#compose-body").value;     
        submit_post(post_body, this.location.reload);
        document.querySelector('#compose-body').value = '';
        
        // stop form from submitting
        return false;
        };
    }
    
    // showing user's page
    document.querySelectorAll('.users').forEach((user) => {
        user.onclick = () => {
            profileLoading(user.dataset.userid);
        } 
    });

});

// a function for showing previous posts 
function showing_posts(page, profileID) {

    document.querySelector('#previousposts').innerHTML = '';
    if (page == 'all') {
        url = '/posts'
    } else if(page == 'following') {
        url = `/profile/${profileID}/posts/following`
    } else {
        url = `/profile/${profileID}/posts`
    }
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const div = document.createElement('div');
            const hr = document.createElement('hr')
            const head = document.createElement('h4');
            const text = document.createElement('text');
            const time = document.createElement('time');
            const likes = document.createElement('text');
            const button = document.createElement('button')
            const button2 = document.createElement('button')

            head.innerHTML = element.user;
            text.innerHTML = element.body;
            time.innerHTML = element.timestamp;
            likes.innerHTML = element.likes;
            button.innerHTML = 'Like';
            button.classList.add('like');
            button.dataset.post_id = element.id;
            button2.innerHTML = 'Unlike';
            button2.classList.add('unlike');
            button2.dataset.post_id = element.id;
            
            const activeUser = document.querySelector('#allposts-view').dataset.activeuserid;

            if(activeUser == element.user_id || activeUser=='None') {
                button.style.display = 'none';
                button2.style.display = 'none';
            } else if (element.likers.includes(+activeUser)) {
                button.style.display = 'none';
                button2.style.display = 'block';
            } else {
                button.style.display = 'block';
                button2.style.display = 'none';
            }

            div.classList.add("border", "rounded", "border-5", "shadow-lg", "p-3", "mb-5", "bg-body")
            div.append(head, text, hr, time, `| Likes❤️`, likes, button, button2);
            document.querySelector('#previousposts').append(div);

        });
    liking();
    unliking();
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
        user_id = document.querySelector('#profile-link').dataset.userid;

        // Show the all-posts view and hide other views
        profileLoading(user_id);
        
    } else if (page === 'allposts-view') {
        
        // Show the all-posts view and hide other views
        document.querySelector('#allposts-view').style.display = 'block';
        document.querySelector('#previousposts').style.display = 'block';
        document.querySelector('#network-view').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'none';
        document.querySelector('#page-title').innerHTML = 'All Posts';  
        
    } else if (page === 'following-view') {
        
        // Show the following view and hide other views
        document.querySelector('#allposts-view').style.display = 'block';
        document.querySelector('#previousposts').style.display = 'block';
        document.querySelector('#network-view').style.display = 'none';
        document.querySelector('#profile-view').style.display = 'none';
        document.querySelector('#newpost').style.display = 'none';
        document.querySelector('#page-title').innerHTML = 'Posts from Followed Users';
        showing_posts('following', document.querySelector('#profile-link').dataset.userid);

    } else if (page === 'network-view') {

        // Show the network view and hide other views
        document.querySelector('#allposts-view').style.display = 'none';
        document.querySelector('#previousposts').style.display = 'none';
        document.querySelector('#network-view').style.display = 'block';
        document.querySelector('#profile-view').style.display = 'none'; 
        document.querySelector('#page-title').innerHTML = 'Network';
    }

};

// loading profile page
function profileLoading(user_id) {
    document.querySelector('#allposts-view').style.display = 'none';
    document.querySelector('#network-view').style.display = 'none';
    document.querySelector('#profile-view').style.display = 'block';
    document.querySelector('#previousposts').style.display = 'block';

    fetch(`/profile/${user_id}`)
    .then(response => response.json())
    .then(data => {

        document.querySelector('#page-title').innerHTML = data[0].username;
        document.querySelector('#followerCount').innerHTML = data[0].follower;
        document.querySelector('#followingCount').innerHTML = data[0].following;
        
        if (document.querySelector('#follow')) {
            if (data[0].id == document.querySelector('#follow').dataset.activeuserid){
                document.querySelector('#follow').style.display = 'none'
            } else {
                document.querySelector('#follow').style.display = 'block'
            }
        }
    })
    
    showing_posts('profile',user_id);
};

// liking a post
function liking () {
    document.querySelectorAll('.like').forEach((button) => {
        button.onclick = () => {
            like_post(button.dataset.post_id);
            button.parentElement.children[4].innerHTML ++;
            button.nextSibling.style.display = 'block'
            button.style.display = 'none';
        }
    });
}

// unliking a post
function unliking () {
    document.querySelectorAll('.unlike').forEach((button) => {
        button.onclick = () => {
            unlike_post(button.dataset.post_id);
            button.parentElement.children[4].innerHTML --;
            button.previousSibling.style.display = 'block'
            button.style.display = 'none';
        }
    });
}

// a function for posting like 
function like_post(post_id) {

    const csrftoken =  document.querySelector("[name='csrfmiddlewaretoken']").value
    
    const data ={
      post_id:`${post_id}`,
    }
    fetch('/like', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'X-CSRFToken': csrftoken},
      mode: 'same-origin'
    })
    .then(response => response.json())
    .then(information => console.log(information));

};

// a function for posting unlike 
function unlike_post(post_id) {

    const csrftoken =  document.querySelector("[name='csrfmiddlewaretoken']").value
    
    const data ={
      post_id:`${post_id}`,
    }
    fetch('/unlike', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'X-CSRFToken': csrftoken},
      mode: 'same-origin'
    })
    .then(response => response.json())
    .then(information => console.log(information));

};