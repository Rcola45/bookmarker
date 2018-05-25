
document.getElementById('create-bookmark-btn').addEventListener('click', createBookmark);
updateBookmarkList();


function createBookmark(){
    let nameValue = document.getElementById('name-input').value;
    let urlValue = document.getElementById('url-input').value;

    /**
     * Error checking the inputs
     * TODO: Make a proper error div instead of alerts
     */
    if(!nameValue) {
        alert('Name field must be filled');
        return;
    }
    if(!urlValue){
        alert('URL field must be filled');
        return;
    }
    let urlPattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if(!urlPattern.test(urlValue)){
        alert('Not a valid URL');
        return;
    }


    /**
     * The actual making of a bookmark
     */
    if (typeof(Storage) !== "undefined") {
        // Browser supports local storage

        // Store array as string in local storage,
        // JSON.parse() to read back (since local storage only supports strings)
        let bookmarks = (localStorage.getItem('bookmarks')) ? JSON.parse(localStorage.getItem('bookmarks')) : [];

        let newBookmark = {
            name: nameValue,
            url: urlValue
        };

        let currentNames = bookmarks.map(bookmark => {
            return bookmark.name;
        });

        if(currentNames.includes(nameValue)){
            alert('This is a duplicate name');
            return;
        }

        bookmarks.unshift(newBookmark);


        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

        document.getElementById('name-input').value = "";
        document.getElementById('url-input').value = "";

        updateBookmarkList();

    } else {
        // No web storage support
        alert('Your browser type does not allow for use of local storage.');
    }
}


function updateBookmarkList(){
    let listElement = document.getElementById('bookmark-list');

    let bookmarks = (localStorage.getItem('bookmarks')) ? JSON.parse(localStorage.getItem('bookmarks')) : [];

    if(bookmarks.length !== 0){
        let currentBookmarks = listElement.getElementsByClassName('collection-item');
        let currentNames = [...currentBookmarks].map(bookmark => {
            return bookmark.getElementsByTagName('a')[0].innerHTML;
        });
        console.log(currentNames);
        bookmarks = bookmarks.reverse();
        for(let i=0; i < bookmarks.length; i++){
            if(!currentNames.includes(bookmarks[i].name)) {
                listElement.insertAdjacentHTML('beforeend',
                    "<li class='collection-item valign-wrapper'>" +
                        "<a class='bookmark-link' href='"+bookmarks[i].url+"' target='_blank'>"+bookmarks[i].name+"</a>" +
                        "<button class='secondary-content btn' onclick='deleteBookmark(this.parentNode)'>\n" +
                            "<i class='small material-icons'>delete</i>" +
                        "</button>");
            }
        }
    }
}

function deleteBookmark(bookmark){
    // Delete a bookmark from storage and update list
    let bookmarkName = bookmark.getElementsByTagName('a')[0].innerHTML;
    let bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    bookmarks.forEach((bookmark,i) => {
        if(bookmark.name === bookmarkName){
            bookmarks.splice(i, 1);
            return;
        }
    });

    // Send new array with deleted element to local storage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Remove element from rendered list
    document.getElementById('bookmark-list').removeChild(bookmark);


}