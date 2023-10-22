loadFromLocalStorage();
var commentsArray = [];
var editMode = false;
var Post = /** @class */ (function () {
    function Post(title, textArea, commentsArray) {
        this.title = title;
        this.textArea = textArea;
        this.commentsArray = commentsArray;
        Post.newId++;
        this.id = Post.newId;
    }
    Post.newId = 0;
    return Post;
}());
var Comments = /** @class */ (function () {
    function Comments(content) {
        this.content = content;
        Comments.newId++;
        this.id = Comments.newId;
    }
    Comments.newId = 0;
    return Comments;
}());
function submitPost(event) {
    event.preventDefault();
    var topic = document.querySelector(".topic");
    var textArea = document.querySelector(".text-area");
    var comments = [];
    var post = new Post(topic.value, textArea.value, comments);
    postTemplate(post);
    savePostToLocalStorage(post);
}
function postTemplate(post) {
    var postId = post.id;
    var containerDiv = document.querySelector(".posts-container");
    var postBox = document.createElement("div");
    var postBoxLower = document.createElement("div");
    var title = document.createElement("h3");
    var textArea = document.createElement("textarea");
    var commentsSection = document.createElement("div");
    var commentFormDiv = document.createElement("div");
    var editButton = createButton("editButton", "Edit", function (event) { return editPost(event, post, postBox, postBoxLower); });
    var deleteButton = createButton("deleteButton", "Delete", function () { return deletePost(title, postId); });
    postBoxLower.className = "postBoxLower";
    postBox.className = "postBox";
    title.textContent = post.title;
    title.className = "postTitle";
    textArea.textContent = post.textArea;
    textArea.className = "postTextArea";
    textArea.readOnly = true;
    commentFormDiv.className = "commentsDiv";
    commentsSection.className = "commentsSection";
    commentsFormCreation(commentFormDiv, post, postBoxLower, postBox, commentsSection);
    postBox.appendChild(title);
    postBox.appendChild(textArea);
    postBoxLower.appendChild(commentsSection);
    postBoxLower.appendChild(commentFormDiv);
    postBoxLower.appendChild(deleteButton);
    postBoxLower.appendChild(editButton);
    postBox.appendChild(postBoxLower);
    containerDiv.appendChild(postBox);
}
function commentsFormCreation(comments, post, postBoxLower, postBox, commentsSection) {
    var commentsForm = document.createElement("div");
    var commentInput = document.createElement("input");
    var addCommentButton = createButton("addCommentButton", "Comment", function () { return addComment(post, postBox, postBoxLower, commentsSection, commentInput); });
    commentsForm.className = "commentsForm";
    commentInput.className = "commentInput";
    commentsForm.appendChild(commentInput);
    commentsForm.appendChild(addCommentButton);
    comments.appendChild(commentsForm);
}
function addComment(post, postBox, postBoxLower, commentsSection, commentInput) {
    var comment = new Comments(commentInput.value);
    var commentDiv = document.createElement("div");
    var commentContent = document.createElement("p");
    var xComment = createButton("deleteComment", "X", function () { return deleteComment(post, commentContent, comment); });
    var editCommentButton = createButton("editComment", "Edit", function (event) { return editComment(event, postBox, postBoxLower, commentContent, comment); });
    commentDiv.className = "commentDiv";
    commentContent.textContent = commentInput.value;
    commentDiv.appendChild(commentContent);
    commentDiv.appendChild(xComment);
    commentDiv.appendChild(editCommentButton);
    commentsSection.appendChild(commentDiv);
    post.commentsArray.push(comment);
    console.log(post);
    updatePostLocalStorage(post);
}
function deletePost(postElement, postId) {
    var _a;
    (_a = postElement.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
    deleteFromLocalStorage(postId);
}
function editPost(event, post, postBox, postBoxLower) {
    var target = event.target;
    if (target && !editMode) {
        var newPostContainer = document.createElement("div");
        var newTitleInput_1 = document.createElement("input");
        var newTextAreaInput_1 = document.createElement("textarea");
        var updateButton_1 = createButton("updateButton", "Update", function (event) { return updatePost(event, post, postBox, updateButton_1, cancelButton_1, newTitleInput_1, newTextAreaInput_1, postBoxLower); });
        var cancelButton_1 = createButton("cancelButton", "Cancel", function () { return removeEditButtons(updateButton_1, cancelButton_1, newTitleInput_1, newTextAreaInput_1, postBoxLower); });
        newTitleInput_1.placeholder = "Update Post Title";
        newTextAreaInput_1.placeholder = "Update Post Content";
        postBoxLower.classList.add("hidden");
        newPostContainer.appendChild(newTitleInput_1);
        newPostContainer.appendChild(newTextAreaInput_1);
        newPostContainer.className = "newPostContainer";
        postBox.appendChild(newPostContainer);
        postBox.appendChild(updateButton_1);
        postBox.appendChild(cancelButton_1);
        editMode = true;
    }
}
function updatePost(event, post, postBox, updateButton, cancelButton, newTitleInput, newTextAreaInput, postBoxLower) {
    event.preventDefault();
    var target = event.target;
    var postBoxTitle = postBox.querySelector(".postTitle");
    var postBoxTextArea = postBox.querySelector(".postTextArea");
    if (target) {
        post.title = newTitleInput.value;
        post.textArea = newTextAreaInput.value;
        postBoxTitle.textContent = newTitleInput.value;
        postBoxTextArea.textContent = newTextAreaInput.value;
        removeEditButtons(updateButton, cancelButton, newTitleInput, newTextAreaInput, postBoxLower);
        updatePostLocalStorage(post);
    }
}
function removeEditButtons(updateButton, cancelButton, newTitleInput, newTextAreaInput, postBoxLower) {
    updateButton.remove();
    cancelButton.remove();
    newTitleInput.remove();
    newTextAreaInput.remove();
    postBoxLower.classList.remove("hidden");
    editMode = false;
}
function deleteComment(post, commentElement, comment) {
    var _a;
    (_a = commentElement.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
    post.commentsArray = post.commentsArray.filter(function (c) { return c !== comment; });
}
function editComment(event, postBox, postBoxLower, commentContent, comment) {
    var target = event.target;
    if (target) {
        var changeCommentContainer = document.createElement("div");
        var commentBeforeChange_1 = document.createElement("p");
        var changeCommentInput_1 = document.createElement("input");
        var changeCommentApplyButton_1 = createButton("changeCommentApplyButton", "Apply", function (event) { return applyNewComment(event, postBoxLower, changeCommentInput_1, changeCommentApplyButton_1, commentContent, comment, commentBeforeChange_1); });
        postBoxLower.classList.add("hidden");
        commentBeforeChange_1.textContent = comment.content;
        changeCommentContainer.className = "changeCommentContainer";
        changeCommentContainer.appendChild(commentBeforeChange_1);
        changeCommentContainer.appendChild(changeCommentInput_1);
        changeCommentContainer.appendChild(changeCommentApplyButton_1);
        postBox.appendChild(changeCommentContainer);
    }
}
function applyNewComment(event, postBoxLower, changeCommentInput, changeCommentApplyButton, commentContent, comment, commentBeforeChange) {
    var target = event.target;
    if (target) {
        commentContent.textContent = changeCommentInput.value;
        comment.content = changeCommentInput.value;
        console.log(comment);
        postBoxLower.classList.remove("hidden");
        changeCommentInput.remove();
        changeCommentApplyButton.remove();
        commentBeforeChange.remove();
    }
}
function savePostToLocalStorage(post) {
    var posts = localStorage.getItem("posts");
    var parsedPosts = posts ? JSON.parse(posts) : [];
    if (Array.isArray(parsedPosts)) {
        parsedPosts.push(post);
    }
    else {
        parsedPosts = [post];
    }
    localStorage.setItem("posts", JSON.stringify(parsedPosts));
    console.log(post);
}
function updatePostLocalStorage(updatedPost) {
    var posts = localStorage.getItem("posts");
    var parsedPosts = posts ? JSON.parse(posts) : [];
    var index = parsedPosts.findIndex(function (post) { return post.id === updatedPost.id; });
    if (index !== -1) {
        parsedPosts[index] = updatedPost;
        localStorage.setItem("posts", JSON.stringify(parsedPosts));
    }
    console.log("Post updated in local storage:", updatedPost);
}
function deleteFromLocalStorage(postId) {
    var posts = localStorage.getItem("posts");
    var parsedPosts = JSON.parse(posts);
    var index = parsedPosts.findIndex(function (post) { return post.id === Number(postId); });
    if (index !== -1) {
        parsedPosts.splice(index, 1);
        console.log(parsedPosts);
        localStorage.setItem("posts", JSON.stringify(parsedPosts));
    }
}
function loadFromLocalStorage() {
    var posts = localStorage.getItem("posts");
    if (posts) {
        var parsedPosts = JSON.parse(posts);
        if (Array.isArray(parsedPosts)) {
            parsedPosts.forEach(function (post) {
                postTemplate(post);
            });
        }
    }
}
function createButton(className, textContent, clickHandler) {
    var button = document.createElement("button");
    button.className = className;
    button.textContent = textContent;
    button.addEventListener("click", clickHandler);
    return button;
}
