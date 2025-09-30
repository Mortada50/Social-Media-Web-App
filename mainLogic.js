const baseUrl = "https://tarmeezacademy.com/api/v1"

function setupUI() {

    const token = localStorage.getItem("token")
    const loginDiv = document.getElementById("loggedin-div")
    const addBtn = document.getElementById("add-post-div")
    const logoutDiv = document.getElementById("logout-div")
    const sendCommint = document.getElementById("commint")

    let user = getCurrentUser()

    if (token == null) {
        // user is gest 
        logoutDiv.style.setProperty("display", "none", "important")
        loginDiv.style.setProperty("display", "flex", "important")
        document.getElementById("loggedin-profileimg").style.setProperty("display", "none", "important")
        document.getElementById("loggedin-name").style.setProperty("display", "none", "important")
        if (addBtn != null) {

            addBtn.style.display = "none"
        }
        if (sendCommint != null) {

            sendCommint.style.setProperty("display", "none", "important")
        }
    } else { // for logged in user
        logoutDiv.style.setProperty("display", "flex", "important")
        loginDiv.style.setProperty("display", "none", "important")
        document.getElementById("loggedin-profileimg").style.setProperty("display", "flex", "important")
        document.getElementById("loggedin-name").style.setProperty("display", "flex", "important")
        document.getElementById("loggedin-profileimg").src = user.profile_image
        document.getElementById("loggedin-name").innerText = user.username
        if (addBtn != null) {
            addBtn.style.display = "block"
        }
        if (sendCommint != null) {

            sendCommint.style.setProperty("display", "flex", "important")
        }
    }
}

function getCurrentUser() {
    let user = null
    const storageUser = localStorage.getItem("user")
    if (storageUser != null) {

        user = JSON.parse(storageUser)
    }

    return user
}


// ******* AUTH FUNCTIONS ******//

function loginBtnClicked() {

    toggleLoader(true)
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value
    const params = {
        "username": username,
        "password": password
    }
    const url = `${baseUrl}/login`
    axios.post(url, params)
        .then(Response => {
            toggleLoader(false)
            localStorage.setItem("token", Response.data.token)
            localStorage.setItem("user", JSON.stringify(Response.data.user))
            const modal = document.getElementById("Login-Modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            setupUI()

            showAlert("Logged in successfully", "success")

        })
        .catch(error => {
            const message = error.response.data.message
            showAlert(message, "danger")
        })
        .finally(() => {
            toggleLoader(false)
        })


}


function registerBtnClicked() {
    toggleLoader(true)

    const registerUsername = document.getElementById("register-username").value
    const registerName = document.getElementById("register-name").value
    const registerPassword = document.getElementById("register-password").value
    const registerProfileImage = document.getElementById("profile-image-input").files[0]
    const formData = new FormData()
    formData.append("username", registerUsername)
    formData.append("password", registerPassword)
    formData.append("name", registerName)
    formData.append("image", registerProfileImage)

    const url = `${baseUrl}/register`
    axios.post(url, formData)
        .then(Response => {
            toggleLoader(false)

            localStorage.setItem("token", Response.data.token)
            localStorage.setItem("user", JSON.stringify(Response.data.user))
            const modal = document.getElementById("register-Modal")
            const modalInstance = bootstrap.Modal.getInstance(modal)
            modalInstance.hide()
            setupUI()
            showAlert("New User Registered successfully", "success")

        })
        .catch(error => {
            const message = error.response.data.message
            showAlert(message, "danger")
        })
        .finally(() => {
            toggleLoader(false)
        })
}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    showAlert("Logged out successfully", "success")
    setupUI()

}
// *******// AUTH FUNCTIONS //******//

function showAlert(customMessage, type) {
    const alertPlaceholder = document.getElementById('success-alert');

    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
            `   <div>${message}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('');

        alertPlaceholder.append(wrapper);

        setTimeout(() => {
            const alertElement = wrapper.querySelector('.alert'); 
            const alertInstance = bootstrap.Alert.getOrCreateInstance(alertElement);
            alertInstance.close();
        }, 2000); 
    }

    appendAlert(customMessage, type);
}


function deletePostBtnClicked(postId){
    document.getElementById("delete-post-id-input").value = postId
    let postModal = new bootstrap.Modal(document.getElementById("delete-post-Modal"),{})
    
    postModal.toggle()
    

}

function confirmPostDelete(){
    toggleLoader(true)
    const postId = document.getElementById("delete-post-id-input").value
    
    let url = `${baseUrl}/posts/${postId}`
    
    const token = localStorage.getItem("token")
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }

    axios.delete(url,{
        headers:headers
    })
    .then(Response => {
        toggleLoader(false)
        const modal = document.getElementById("delete-post-Modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert("Post Has Been Deleted Successfully","success")
        getposts()
    })
    .catch(error => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
    .finally(() => {
       toggleLoader(false)
    })
}

function editPostBtnClicked(postObject){
    let post = JSON.parse(decodeURIComponent(postObject))
    console.log(post)
    document.getElementById("post-modal-submit-btn").innerHTML = "Update"
    document.getElementById("post-id-input").value = post.id
    document.getElementById("post-modal-title").innerHTML = "Edit Post"
    document.getElementById("post-title-input").value = post.title
    document.getElementById("post-body-input").value = post.body
    let postModal = new bootstrap.Modal(document.getElementById("create-post-Modal"),{})
    
    postModal.toggle()

}


function createNewPostClicked() {
    toggleLoader(true)
    let postId = document.getElementById("post-id-input").value
    let isCreate = postId == null || postId == ""
    


    const title = document.getElementById("post-title-input").value
    const body = document.getElementById("post-body-input").value
    const image = document.getElementById("post-image-input").files[0]

    let formData = new FormData()
    formData.append("body", body)
    formData.append("title", title)
    formData.append("image", image)


    const token = localStorage.getItem("token")
    const headers = {
        "Content-Type": "multipart/form-data",
        "authorization": `Bearer ${token}`
    }
    let url = ``
    let message = ``
    if(isCreate){
        url = `${baseUrl}/posts`
         message = "New Post Has Been Created"
      
    }else{
        formData.append("_method","put")
        url=`${baseUrl}/posts/${postId}`
        message = " Post Has Been Updated Successfully"
    }
    axios.post(url, formData, {
    headers: headers
    })
    .then(Response => {
        toggleLoader(false)
        const modal = document.getElementById("create-post-Modal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        showAlert(message , "success")
        getposts()

    })
    .catch(error => {
        const message = error.response.data.message
        showAlert(message, "danger")
    })
    .finally(() => {
        toggleLoader(false)
    })
    
}

function profileClicked(){
    const user = getCurrentUser()
   const userId = user.id
    window.location = `profile.html?userid=${userId}`
}

function addBtnClicked(){
   
    document.getElementById("post-modal-submit-btn").innerHTML = "Create"
    document.getElementById("post-id-input").value = ""
    document.getElementById("post-modal-title").innerHTML = "Create A New Post"
    document.getElementById("post-title-input").value = ""
    document.getElementById("post-body-input").value = ""
    let postModal = new bootstrap.Modal(document.getElementById("create-post-Modal"),{})
    
    postModal.toggle()  
}


function toggleLoader(show = true){
    if(show){
        document.getElementById("lodar").style.visibility = "visible"

    }else{

        document.getElementById("lodar").style.visibility = "hidden"

    }
}
