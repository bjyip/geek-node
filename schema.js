const { buildSchema } = require('graphql');

const mockData = [
  {
      id: 1,
      avatar: 'https://static001.geekbang.org/account/avatar/00/0f/52/62/1b3ebed5.jpg',
      name: '僵尸浩',
      isTop: true,
      content: '哈哈哈哈',
      publishDate: '今天',
      commentNum: 10,
      praiseNum: 5
  },
  {
      id: 2,
      avatar: 'https://static001.geekbang.org/account/avatar/00/0f/52/62/1b3ebed5.jpg',
      name: '极客主编',
      isTop: true,
      content: '我来送大礼了！！',
      publishDate: '上周',
      commentNum: 10,
      praiseNum: 2
  },
  {
      id: 3,
      avatar: 'https://static001.geekbang.org/account/avatar/00/0f/52/62/1b3ebed5.jpg',
      name: '极客老板',
      isTop: true,
      content: '我来发股票了！！！',
      publishDate: '十年前',
      commentNum: 10,
      praiseNum: 0
  }
]

const schema = buildSchema(`
  type Comment {
    id: Int
    avatar: String
    name: String
    isTop: Boolean
    content: String
    publishDate: String
    commentNum: Int
    praiseNum: Int
  }

  type Query {
    comment: [Comment]
  }

  type Mutation {
    praise(id: Int): Int
  }
`);

schema.getQueryType().getFields().comment.resolve = () => {
  return mockData
}

schema.getMutationType().getFields().praise.resolve = (args0, { id }) => {
  mockData.forEach(item => {
    if (item.id === id) {
      item.praiseNum++;
    }
  })
  return mockData.find(item => item.id === id).praiseNum;
}

module.exports = schema;