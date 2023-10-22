loadFromLocalStorage();

const commentsArray: Comments[] = [];
let editMode = false;

class Post {
    private static newId = 0;
    public id: number;

    constructor(public title: string, public textArea: string, public commentsArray: Comments[]) {
        Post.newId++;
        this.id = Post.newId;
    }
}

class Comments {
    private static newId = 0;
    public id: number;

    constructor(public content: string) {
        Comments.newId++;
        this.id = Comments.newId;
    }
}

function submitPost(event: MouseEvent) {
    event.preventDefault();

    const topic = document.querySelector(".topic") as HTMLInputElement;
    const textArea = document.querySelector(".text-area") as HTMLInputElement;
    const comments: Comments[] = [];
    const post = new Post(topic.value, textArea.value, comments);

    postTemplate(post);
    savePostToLocalStorage(post);
}

function postTemplate(post: Post) {
    const postId: number = post.id;
    const containerDiv = document.querySelector(".posts-container") as HTMLDivElement;
    const postBox = document.createElement("div") as HTMLDivElement;
    const postBoxLower = document.createElement("div") as HTMLDivElement;
    const title = document.createElement("h3") as HTMLElement;
    const textArea = document.createElement("textarea") as HTMLTextAreaElement;
    const commentsSection = document.createElement("div") as HTMLDivElement;
    const commentFormDiv = document.createElement("div") as HTMLDivElement;
    const editButton = createButton("editButton", "Edit", (event: MouseEvent) => editPost(event, post, postBox, postBoxLower));
    const deleteButton = createButton("deleteButton", "Delete", () => deletePost(title, postId));

    postBoxLower.className = "postBoxLower";
    postBox.className = "postBox";
    title.textContent = post.title;
    title.className = "postTitle";
    textArea.textContent = post.textArea;
    textArea.className = "postTextArea";
    textArea.readOnly = true;
    commentFormDiv.className = "commentsDiv";
    commentsSection.className = "commentsSection"

    commentsFormCreation(commentFormDiv, post, postBoxLower, postBox, commentsSection)
    postBox.appendChild(title);
    postBox.appendChild(textArea);
    postBoxLower.appendChild(commentsSection);
    postBoxLower.appendChild(commentFormDiv);
    postBoxLower.appendChild(deleteButton);
    postBoxLower.appendChild(editButton);
    postBox.appendChild(postBoxLower);
    containerDiv.appendChild(postBox);
}

function commentsFormCreation(comments: HTMLDivElement, post: Post, postBoxLower: HTMLDivElement, postBox: HTMLDivElement, commentsSection: HTMLDivElement) {
    const commentsForm = document.createElement("div") as HTMLDivElement;
    const commentInput = document.createElement("input") as HTMLInputElement;
    const addCommentButton = createButton("addCommentButton", "Comment", () => addComment(post, postBox, postBoxLower, commentsSection, commentInput));

    commentsForm.className = "commentsForm";
    commentInput.className = "commentInput";

    commentsForm.appendChild(commentInput);
    commentsForm.appendChild(addCommentButton);
    comments.appendChild(commentsForm);
}

function addComment(post: Post, postBox: HTMLDivElement, postBoxLower: HTMLDivElement, commentsSection: HTMLDivElement, commentInput: HTMLInputElement) {
    const comment = new Comments(commentInput.value);
    const commentDiv = document.createElement("div") as HTMLDivElement;
    const commentContent = document.createElement("p") as HTMLParagraphElement;
    const xComment = createButton("deleteComment", "X", () => deleteComment(post, commentContent, comment));
    const editCommentButton = createButton("editComment", "Edit", (event: MouseEvent) => editComment(event, postBox, postBoxLower, commentContent, comment));

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

function deletePost(postElement: HTMLElement, postId: number) {
    postElement.parentElement?.remove();
    deleteFromLocalStorage(postId);
}

function editPost(event: MouseEvent, post: Post, postBox: HTMLDivElement, postBoxLower: HTMLDivElement) {
    let target = event.target as HTMLInputElement;

    if (target && !editMode) {
        const newPostContainer = document.createElement("div") as HTMLDivElement;
        const newTitleInput = document.createElement("input") as HTMLInputElement;
        const newTextAreaInput = document.createElement("textarea") as HTMLTextAreaElement;
        const updateButton = createButton("updateButton", "Update", (event: MouseEvent) => updatePost(event, post, postBox, updateButton, cancelButton, newTitleInput, newTextAreaInput, postBoxLower));
        const cancelButton = createButton("cancelButton", "Cancel", () => removeEditButtons(updateButton, cancelButton, newTitleInput, newTextAreaInput, postBoxLower));

        newTitleInput.placeholder = "Update Post Title";
        newTextAreaInput.placeholder = "Update Post Content";
        postBoxLower.classList.add("hidden");

        newPostContainer.appendChild(newTitleInput);
        newPostContainer.appendChild(newTextAreaInput);

        newPostContainer.className = "newPostContainer";

        postBox.appendChild(newPostContainer);
        postBox.appendChild(updateButton);
        postBox.appendChild(cancelButton);

        editMode = true;
    }
}

function updatePost(event: MouseEvent, post: Post, postBox: HTMLDivElement, updateButton: HTMLButtonElement, cancelButton: HTMLButtonElement, newTitleInput: HTMLInputElement, newTextAreaInput: HTMLTextAreaElement, postBoxLower: HTMLDivElement) {
    event.preventDefault();

    let target = event.target as HTMLButtonElement;
    const postBoxTitle = postBox.querySelector(".postTitle") as HTMLElement;
    const postBoxTextArea = postBox.querySelector(".postTextArea") as HTMLElement;

    if (target) {
        post.title = newTitleInput.value;
        post.textArea = newTextAreaInput.value;
        postBoxTitle.textContent = newTitleInput.value;
        postBoxTextArea.textContent = newTextAreaInput.value;

        removeEditButtons(updateButton, cancelButton, newTitleInput, newTextAreaInput, postBoxLower);
        updatePostLocalStorage(post)
    }
}

function removeEditButtons(updateButton: HTMLButtonElement, cancelButton: HTMLButtonElement, newTitleInput: HTMLInputElement, newTextAreaInput: HTMLTextAreaElement, postBoxLower: HTMLDivElement) {
    updateButton.remove();
    cancelButton.remove();
    newTitleInput.remove();
    newTextAreaInput.remove();

    postBoxLower.classList.remove("hidden");

    editMode = false;
}

function deleteComment(post: Post, commentElement: HTMLElement, comment: Comments) {
    commentElement.parentElement?.remove();
    post.commentsArray = post.commentsArray.filter(c => c !== comment);
}

function editComment(event: MouseEvent, postBox: HTMLDivElement, postBoxLower: HTMLDivElement, commentContent: HTMLElement, comment: Comments) {
    let target = event.target as HTMLButtonElement;

    if (target) {
        const changeCommentContainer = document.createElement("div") as HTMLInputElement;
        const commentBeforeChange = document.createElement("p") as HTMLParagraphElement;
        const changeCommentInput = document.createElement("input") as HTMLInputElement;
        const changeCommentApplyButton = createButton("changeCommentApplyButton", "Apply", (event: MouseEvent) => applyNewComment(event, postBoxLower, changeCommentInput, changeCommentApplyButton, commentContent, comment, commentBeforeChange))

        postBoxLower.classList.add("hidden");
        commentBeforeChange.textContent = comment.content;
        changeCommentContainer.className = "changeCommentContainer";

        changeCommentContainer.appendChild(commentBeforeChange);
        changeCommentContainer.appendChild(changeCommentInput);
        changeCommentContainer.appendChild(changeCommentApplyButton);
        postBox.appendChild(changeCommentContainer);
    }
}

function applyNewComment(event: MouseEvent, postBoxLower: HTMLDivElement, changeCommentInput: HTMLInputElement, changeCommentApplyButton: HTMLButtonElement, commentContent: HTMLElement, comment: Comments, commentBeforeChange: HTMLParagraphElement) {
    let target = event.target as HTMLButtonElement;

    if (target) {
        commentContent.textContent = changeCommentInput.value;
        comment.content = changeCommentInput.value;
        console.log(comment);

        postBoxLower.classList.remove("hidden");
        changeCommentInput.remove();
        changeCommentApplyButton.remove();
        commentBeforeChange.remove()
    }
}

function savePostToLocalStorage(post: Post) {
    const posts = localStorage.getItem("posts");
    let parsedPosts: Post[] = posts ? JSON.parse(posts) : [];

    if (Array.isArray(parsedPosts)) {
        parsedPosts.push(post);
    } else {
        parsedPosts = [post];
    }

    localStorage.setItem("posts", JSON.stringify(parsedPosts));
    console.log(post);
}

function updatePostLocalStorage(updatedPost: Post) {
    const posts = localStorage.getItem("posts");
    let parsedPosts: Post[] = posts ? JSON.parse(posts) : [];

    const index = parsedPosts.findIndex(post => post.id === updatedPost.id);

    if (index !== -1) {
        parsedPosts[index] = updatedPost;
        localStorage.setItem("posts", JSON.stringify(parsedPosts));
    }
    console.log("Post updated in local storage:", updatedPost);

}

function deleteFromLocalStorage(postId: Number) {
    const posts = localStorage.getItem("posts");
    let parsedPosts: Post[] = JSON.parse(posts!);

    const index = parsedPosts.findIndex(post => post.id === Number(postId));

    if (index !== -1) {
        parsedPosts.splice(index, 1);
        console.log(parsedPosts);
        localStorage.setItem("posts", JSON.stringify(parsedPosts));
    }
}

function loadFromLocalStorage() {
    const posts = localStorage.getItem("posts");

    if (posts) {
        let parsedPosts = JSON.parse(posts);

        if (Array.isArray(parsedPosts)) {
            parsedPosts.forEach((post: Post) => {
                postTemplate(post);
            });
        }
    }
}

function createButton(className: string, textContent: string, clickHandler: any) {
    const button = document.createElement("button") as HTMLButtonElement;
    button.className = className;
    button.textContent = textContent;
    button.addEventListener("click", clickHandler);
    return button;
}