// const { default: axios } = require("axios");

let currentPage = 1
let lastPage = 1
//******** INFINITE SCROLL ********//
window.addEventListener("scroll", function () {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
    
    if (endOfPage && currentPage < lastPage) {
        currentPage += 1
        getposts(false, currentPage)

    }
})
//********// INFINITE SCROLL //********//

setupUI()
getposts()
function getposts(reload = true, page = 1) {
    toggleLoader(true)
    axios.get(`${baseUrl}/posts?limit=6&page=${page}`)
        .then(Response => {
            toggleLoader(false)
            const posts = Response.data.data
            lastPage = Response.data.meta.last_page
            if (reload) {

                document.getElementById("posts").innerHTML = ''
            }


            for (post of posts) {

                let postTitle = ""

                //show or hide (edit) button
                let user = getCurrentUser()
                let isMyPost = user != null && post.author.id == user.id
                let editButtonContent = ``
                let deleteButtonContent = ``
                if(isMyPost){
                    editButtonContent = `<button class="btn btn-outline-warning " style='margin-left:3px; float:right;' onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')"> 🖌 </button>`
                    deleteButtonContent = `<button class="btn btn-outline-danger" style='margin-left:3px; float:right;' onclick="deletePostBtnClicked(${post.id})"> 🗑 </button>`
                }
                if (post.title != null) {
                    postTitle = post.title
                }
                if (post.body == null) {
                    continue
                }
                let currentpost = `
                    <div class="card shadow " >
                        <div class="card-header" >
                        <span onclick="userClicked(${post.author.id})" style="cursor:pointer;" >
                            <img src="${post.author.profile_image}" alt="" style=" width: 35px; height: 35px;" class="border border-2 rounded-circle">
                            <b>${post.author.username}</b>
                        </span>
                            ${editButtonContent}
                            ${deleteButtonContent}
                        </div>
                        <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer;">
                            <img src="${post.image}" alt="" style="width: 100%;">
                            

                            <h6 style="color: rgb(163, 160, 160);">
                            ${post.created_at}
                            </h6>
                            <h5>
                                ${postTitle}
                            </h5>
                            <p>
                                ${post.body}                          
                            </p>

                            <hr>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                            </svg>
                            <span>
                                (${post.comments_count}) comments

                                <span id="post-tags-${post.id}">
                                    
                                </span>
                            </span>
                            
                        </div>
                    </div>
                `
                document.getElementById("posts").innerHTML += currentpost
                const currentPostTagsId = `post-tags-${post.id}`
                document.getElementById(currentPostTagsId).innerHTML = ''
                for (tag of post.tags) {
                        // console.log(tag.name)
                        let tagsContent = `
                    <button class="btn btn-sm rounded-5" style="background-color:gray; color:white;">
                                            ${tag.name}
                    </button>
                    `
                    document.getElementById(currentPostTagsId).innerHTML += tagsContent
                }

            }
        })
        .catch(error => {
            const message = error.response.data.message
            showAlert(message, "danger")
        })
        .finally(() => {
             toggleLoader(false)
        })
}


function postClicked(postId) {

    window.location = `postDetails.html?postId=${postId}`
}




function userClicked(userId){
   
    window.location = `profile.html?userid=${userId}`
}





