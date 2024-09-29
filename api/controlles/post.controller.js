import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";



export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    // setTimeout(() => {
    res.status(200).json(posts);
    // }, 3000);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get posts" });
  }
};



export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    // Fetch the post along with postDetail and user information
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const token = req.cookies?.token;

    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) {
          return res.status(403).json({ message: "Invalid token" });
        }

        // Check if post is saved by the user
        const saved = await prisma.SavedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });

        // Return the post data along with `isSaved` flag
        return res.status(200).json({ ...post, isSaved: saved ? true : false });
      });
    }

    // If no token is present, return the post with isSaved as false
    return res.status(200).json({ ...post, isSaved: false });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to get post" });
  }
};






export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;



  // Ensure the required fields are present
  if (!body.postData || !body.postData.title) {
    return res.status(400).json({ message: "Title is required!" });
  }

  if (!body.postDetail) {
    return res.status(400).json({ message: "Post detail is required!" });
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData, // Contains fields like title, price, address, etc.
        userId: tokenUserId, // Assign the user ID to the post
        postDetail: {
          create: body.postDetail, // Create the related PostDetail entry
        },
      },
    });

    res.status(200).json(newPost);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create post" });
  }
};

 



export const updatePost = async (req, res) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update posts" });
  }
};

// export const deletePost = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserId = req.userId;

//   try {
//     const post = await prisma.post.findUnique({
//       where: { id },
//     });

//     console.log(post);

//     if (post.userId !== tokenUserId) {
//       return res.status(403).json({ message: "Not Authorized!" });
//     }

//     // await prisma.post.delete({
//     //   where: { id },
//     // });
//     const deletedPost = await prisma.post.delete({
//       where: { id: post.id },  // Use the fetched post's ID to delete it
//     });

//     res.status(200).json({ message: "Post deleted" });
//   } catch (err) {
//     console.log(err.message);
//     res.status(500).json({ message: "Failed to delete post" });
//   }
// };

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    // Fetch the post to find the associated PostDetail ID
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true, // Include related postDetail
      },
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    // Delete the related postDetail first
    if (post.postDetail) {
      await prisma.postDetail.delete({
        where: { id: post.postDetail.id },
      });
    }

    // Now delete the post
    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to delete post" });
  }
};

