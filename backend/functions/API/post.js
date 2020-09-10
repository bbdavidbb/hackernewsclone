const { admin, db } = require("../utils/admin");

exports.createPost = (request, response) => {
    const body = JSON.parse(request.body["body"]);
    var title = body["title"];
    var description = body["description"];
    var post_link = body["link"]
    var uid = body["uid"]
    const newPost = {
        title: title,
        description: description,
        link: post_link,
        uid: uid,
        createdAt: new Date().toISOString()
    }
    console.log(newPost)

    db
        .collection("/Posts")
        .add(newPost)
        .then((doc) => {
            //return the autogenerated ID
            newPost.post_id = doc.id; 
            const responsePost = newPost;
            return response.json(responsePost);
        })
        .catch((err) => {
			response.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
}

exports.deletePost = (request, response) => {
    const document = db.doc(`/Posts/${request.params.post_id}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Post not found' })
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};

exports.editPost = ( request, response ) => { 
    if(request.body.post_id || request.body.createdAt){
        response.status(403).json({message: 'Not allowed to edit these fields'});
    }
    let document = db.collection('/Posts').doc(`${request.params.post_id}`);
    document.update(request.body)
    .then(()=> {
        response.json({message: 'Updated successfully'});
    })
    .catch((err) => {
        console.error(err);
        return response.status(500).json({ 
                error: err.code 
        });
    });
};

