const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require('lodash')
const moment= require('moment');
exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions

  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title,
                date(formatString: "DD/MM/YYYY")
              }
            }
          }
        }
      }
    `
  )

  if (result.errors) {
    throw result.errors
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges
  // creates a formatted date with moment
  const parsedYearMonth= item=>moment(item.node.frontmatter.date,"DD/MM/YYYY").format('YYYY-MM')

  // uses the group function from lodash (it's already added by default, if you don't have it you'll need to install it)
  const groupedByYearMonth=_.groupBy(posts, parsedYearMonth);
  
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
        groupedItems:groupedByYearMonth
      },
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
