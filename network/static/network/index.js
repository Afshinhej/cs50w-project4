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
            const editedText = document.createElement('textarea');
            const saveButton =document.createElement('button');
            const time = document.createElement('time');
            const likes = document.createElement('text');
            const button = document.createElement('button')
            const button2 = document.createElement('button')
            const editButton = document.createElement('button')

            head.innerHTML = element.user;
            text.innerHTML = element.body;
            text.className = 'currentPostBody';
            time.innerHTML = element.timestamp;
            likes.innerHTML = element.likes;
            likes.className = 'likescount';
            button.innerHTML = 'Like';
            button.classList.add('like');
            button.dataset.post_id = element.id;
            button2.innerHTML = 'Unlike';
            button2.classList.add('unlike');
            button2.dataset.post_id = element.id;
            editButton.innerHTML = 'Edit'
            editButton.classList.add('edit');
            editButton.dataset.post_id = element.id;
            editedText.innerHTML = text.innerHTML;
            editedText.className = 'editedPostBody';
            editedText.style.display = 'none';
            saveButton.innerHTML = 'Save';
            saveButton.classList.add('save');
            saveButton.dataset.post_id = element.id;
            saveButton.style.display = 'none';

            const activeUser = document.querySelector('#allposts-view').dataset.activeuserid;

            if(activeUser == element.user_id || activeUser=='None') {
                button.style.display = 'none';
                button2.style.display = 'none';
                editButton.style.display = 'block';
            } else if (element.likers.includes(+activeUser)) {
                button.style.display = 'none';
                button2.style.display = 'block';
                editButton.style.display = 'none';
            } else {
                button.style.display = 'block';
                button2.style.display = 'none';
                editButton.style.display = 'none';
            }

            div.classList.add("border", "rounded", "border-5", "shadow-lg", "p-3", "mb-5", "bg-body")
            div.append(head,editButton, editedText, saveButton, text, hr, time, `| Likes❤️`, likes, button, button2);
            document.querySelector('#previousposts').append(div);

        });
        liking();
        unliking();
        
        document.querySelectorAll('.edit').forEach( (button) => {
            button.onclick = () => {
                loadingEditingTools(button);
            } 
        } )

        document.querySelectorAll('.save').forEach( (button) => {
            button.onclick = () => {
                editing(button);
            } 
        } )

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

        if (data[0].follower_list.includes(+document.querySelector('#follow').dataset.activeuserid)) {
            document.querySelector('#unfollowButton').style.display = 'block';
            document.querySelector('#followButton').style.display = 'none';
        } else {
            document.querySelector('#unfollowButton').style.display = 'none';
            document.querySelector('#followButton').style.display = 'block';
        }
        
        if (document.querySelector('#follow')) {
            if (data[0].id == document.querySelector('#follow').dataset.activeuserid){
                document.querySelector('#follow').style.display = 'none'
            } else {
                document.querySelector('#follow').style.display = 'block'
            }
        }

        follow(user_id);
    })
    
    showing_posts('profile',user_id);
};

// liking a post
function liking () {
    document.querySelectorAll('.like').forEach((button) => {
        button.onclick = () => {
            like_post(button.dataset.post_id);

            for (var i = 0; i < button.parentElement.children.length; i++) {
                if (button.parentElement.children[i].className == 'likescount') {
                    button.parentElement.children[i].innerHTML ++;
                  break;
                }        
            }

            
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
            
            for (var i = 0; i < button.parentElement.children.length; i++) {
                if (button.parentElement.children[i].className == 'likescount') {
                    button.parentElement.children[i].innerHTML --;
                  break;
                }        
            }

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

// follow a user
function follow (user_id) {
    document.querySelector('#followButton').onclick = () => {
        follow_post(user_id, 'follow');
        document.querySelector('#followerCount').innerHTML ++;
        document.querySelector('#unfollowButton').style.display = 'block';
        document.querySelector('#followButton').style.display = 'none';
        
    }
    
    document.querySelector('#unfollowButton').onclick = () => {
        follow_post(user_id, 'unfollow');
        document.querySelector('#followerCount').innerHTML --;
        document.querySelector('#unfollowButton').style.display = 'none';
        document.querySelector('#followButton').style.display = 'block';
    }
    
}


// a function for posting follow/ unfollow 
function follow_post(user_id, action) {

    const csrftoken =  document.querySelector("[name='csrfmiddlewaretoken']").value
    
    const data ={
      user_id:`${user_id}`,
      action: action
    }
    fetch('/follow', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'X-CSRFToken': csrftoken},
      mode: 'same-origin'
    })
    .then(response => response.json())
    .then(information => console.log(information));

};


// function for loading tools for editing a post
function loadingEditingTools(button) {

    for (var i = 0; i < button.parentElement.children.length; i++) {
        if (button.parentElement.children[i].className == 'currentPostBody') {
            button.parentElement.children[i].style.display = 'none';
            break;
        }
    }
    
    for (var i = 0; i < button.parentElement.children.length; i++) {
        if (button.parentElement.children[i].className == 'editedPostBody') {
            button.parentElement.children[i].style.display = 'block';
            break;
        }
    }

    for (var i = 0; i < button.parentElement.children.length; i++) {
        if (button.parentElement.children[i].className == 'save') {
            button.parentElement.children[i].style.display = 'block';
            break;
        }
    }
}

// a function for editing a post 
function editing(button) {
   
    let post_body = '';
    for (var i = 0; i < button.parentElement.children.length; i++) {
        if (button.parentElement.children[i].className == 'editedPostBody') {
            post_body = button.parentElement.children[i].value;
          break;
        }
    }

    const csrftoken =  document.querySelector("[name='csrfmiddlewaretoken']").value
    
    const data ={
      post_body:`${post_body}`,
      post_id:`${button.dataset.post_id}`
    }
    
    fetch('/editpost', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {'X-CSRFToken': csrftoken},
      mode: 'same-origin'
    })
    .then(response => response.json())
    .then(information => console.log(information));
    
    for (var i = 0; i < button.parentElement.children.length; i++) {
        if (button.parentElement.children[i].className == 'currentPostBody') {
            button.parentElement.children[i].style.display = 'block';
            button.parentElement.children[i].innerHTML = post_body;
            break;
        }
    }
    
    for (var i = 0; i < button.parentElement.children.length; i++) {
        if (button.parentElement.children[i].className == 'editedPostBody') {
            button.parentElement.children[i].style.display = 'none';
            break;
        }
    }

    for (var i = 0; i < button.parentElement.children.length; i++) {
        if (button.parentElement.children[i].className == 'save') {
            button.parentElement.children[i].style.display = 'none';
            break;
        }
    }


};