const contentful = require('contentful');
const {client} = require('../utils/config');

//All the blog post
const blogPostSync = async (req, res) => {
  try {
    const postBlog = await client.getEntries();
    if (!postBlog) {
      res.status(404).json({ message: 'User not found.' });
    } else {
      res.json(postBlog);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user.' });
  }
};


//Display 
const blogPostId = async (req, res) => {
  
  try {
    const postBlog = await client.getEntry(req.params.id);
    console.log(postBlog);
    res.status(200).json({ message: 'Found the user id.' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Failed to create user.' });
  }
};

module.exports = {blogPostSync, blogPostId}







  
