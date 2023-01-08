document.addEventListener('DOMContentLoaded', function() {
    
    document.querySelectorAll('.editedPostBody').forEach((element) => element.style.display='none');
    document.querySelectorAll('.save').forEach((element) => element.style.display='none');
    document.querySelectorAll('.edit').forEach((element) => element.style.display='none');    
    document.querySelectorAll('.post').forEach((div) => {
        if (div.dataset.user_id === div.dataset.activeuserid) {
            for (var i = 0; i < div.children.length; i++) {
                if (div.children[i].className == 'edit') {
                    div.children[i].style.display = 'block';
                  break;
                }        
            }
        }
    });    

    document.querySelectorAll('.edit').forEach((button) => {
        button.onclick = () => loadingEditingTools(button);
    })

    document.querySelectorAll('.save').forEach((button) => {
        button.onclick = () => editing(button);
    })
      
    liking();
    unliking();
    if (document.querySelector('#follow')) {follow()}
    

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
});


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


// liking a post
function liking () {
    document.querySelectorAll('.like').forEach((button) => {
        button.onclick = () => {
            like_post(button.dataset.post_id);

            for (var i = 0; i < button.parentElement.children.length; i++) {
                if (button.parentElement.children[i].className == 'likescount') {
                    button.parentElement.children[i].innerHTML ++;
                }
                if (button.parentElement.children[i].className == 'like') {
                    button.parentElement.children[i].style.display = 'none';
                }        
                if (button.parentElement.children[i].className == 'unlike') {
                    button.parentElement.children[i].style.display = 'block';
                }        
            }

            
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
                }        
                if (button.parentElement.children[i].className == 'like') {
                    button.parentElement.children[i].style.display = 'block';
                }        
                if (button.parentElement.children[i].className == 'unlike') {
                    button.parentElement.children[i].style.display = 'none';
            
                }
            }
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
function follow() {
    document.querySelector('#followButton').onclick = () => {
        follow_post(document.querySelector('#unfollowButton').dataset.user_id, 'follow');
        document.querySelector('#followerCount').innerHTML ++;
        document.querySelector('#unfollowButton').style.display = 'block';
        document.querySelector('#followButton').style.display = 'none';
        
    }
    
    document.querySelector('#unfollowButton').onclick = () => {
        follow_post(document.querySelector('#unfollowButton').dataset.user_id, 'unfollow');
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

    button.style.display = 'none';
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
   
    for (var i = 0; i < button.parentElement.children.length; i++) {
        if (button.parentElement.children[i].className == 'edit') {
            button.parentElement.children[i].style.display = 'block';
            break;
        }
    }

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