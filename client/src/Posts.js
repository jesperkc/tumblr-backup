import React from "react";

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {posts: []};

    this.loadPosts();
  }


  loadPosts = async (event) => {

    let response = await fetch('/posts', {
      method: 'get'
    });
    let posts = await response.json();
    this.setState({posts: posts});
  };
  render() {
    return (
      <div className="posts">
        {this.state.posts.map((post)=><Post post={post}/>)}
      </div>
    );
  }
}

// Todo trail
const getComponent = (post) => {
  console.log(post.type);
  switch (post.type) {
    case 'photo':
      return <PostPhoto {...post}/>
    case 'video':
      return <PostVideo {...post}/>
    case 'link':
      return <PostLink {...post}/>
    case 'text':
      return <PostText {...post}/>
  }
}

const Post = ({post}) => (
  <div className="post">
  <div className="post-header">{post.date} - <a href={post.post_url} target="_blank">{post.blog_name}</a></div>
  <div className="post-body">{getComponent(post)}</div>
  <div className="post-footer"></div>
  </div>
)
const PostText = ({title, trail, body}) => (
  <div>
    <h2>{title}</h2>
    <p dangerouslySetInnerHTML={{ __html: body }} />
  </div>
)
const PostLink = ({url}) => (
  <div>Link <a href={url} target="_blank">{url}</a></div>
)
const PostVideo = ({summary, post_url, thumbnail_url, caption}) => (
  <div><h3>{summary}</h3> <a href={post_url} target="_blank"><img src={thumbnail_url} role="presentation"/></a></div>
)
const PostPhoto = ({photos, summary}) => (
  <div><h3>{summary}</h3>{photos.map((p)=><img src={p.original_size.url} role="presentation"/>)}</div>
)

export default Posts