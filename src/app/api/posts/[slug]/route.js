import prisma from "@/utils/connect";
import { Debug } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

// GET SINGLE POST
export const GET = async (req, { params }) => {


  // console.log('getting single post 22' , params);
  const { slug } = params;
console.log(slug , "slug");
  try {
    const post = await prisma.post.update({
      where: { id:slug },
      data: { views: { increment: 1 } },
      include: { user: true },
    });

    Debug(post , "post");
    console.log(post , "post-----------//-----------");

    return new NextResponse(JSON.stringify(post, { status: 200 }));
  } catch (err) {
    console.log(err , "error -------------------//l");
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};


// DELETE POST
export const DELETE = async (req, { params }) => {
  const { slug } = params;

  console.log(slug , "in delte---------------------------------ll----------------//---------------------")

const data = await prisma.post.findUnique({
  where:{id:slug}
})

console.log(data , slug , "all data ------------------------------------ll---------ll0")
  try {
    await prisma.post.delete({
      where: { id:slug },
    });

    return new NextResponse(
      JSON.stringify({ message: "Post deleted" }, { status: 200 })
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Failed to delete post" }, { status: 500 })
    );
  }
};



// UPDATE POST
export const PUT = async (req, { params }) => {



  const { slug } = params;
  const { title, desc, img } = await req.json();

  console.log(slug , title ,  img , "edit page data---------------===");
  console.log(desc , 'desc------------==================//===========');
  try {
    const updatedPost = await prisma.post.update({
      where: { id:slug },
      data: { title, desc, img },
    });

    return new NextResponse(JSON.stringify(updatedPost), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Failed to update post" }, { status: 500 })
    );
  }
};
