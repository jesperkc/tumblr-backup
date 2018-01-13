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
        {this.state.posts.map((post)=>{
          if (post.type === 'photo') return <PostPhoto {...post}/>
          if (post.type === 'video') return <PostVideo {...post}/>
          if (post.type === 'link') return <PostLink {...post}/>
          if (post.type === 'text') return <PostText {...post}/>
          return '';
        })}
      </div>
    );
  }
}

// Todo trail
const PostText = ({title, summary, trail, post_url, date, blog_name}) => (
  <div className="post"><h5>{date} - {blog_name}</h5><h2><a href={post_url} target="_blank">{title}</a></h2> <h4><a href={post_url} target="_blank">{summary}</a></h4></div>
)
const PostLink = ({url, date, blog_name}) => (
  <div className="post"><h5>{date} - {blog_name}</h5>Link <a href={url} target="_blank">{url}</a></div>
)
const PostVideo = ({post_url, thumbnail_url, date, blog_name}) => (
  <div className="post"><h5>{date} - {blog_name}</h5>Video <a href={post_url} target="_blank"><img src={thumbnail_url} role="presentation"/></a></div>
)
const PostPhoto = ({photos, summary, post_url, date, blog_name}) => (
  <div className="post"><h5>{date} - {blog_name}</h5><h3><a href={post_url} target="_blank">{summary}</a></h3>{photos.map((p)=><img src={p.original_size.url} role="presentation"/>)}</div>
)

export default Posts