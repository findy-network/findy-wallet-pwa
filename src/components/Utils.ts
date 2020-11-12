import { gql } from '@apollo/client'

Utils.fragments = {
  pageInfo: gql`
    fragment PageInfoFragment on PageInfo {
      endCursor
      startCursor
      hasPreviousPage
      hasNextPage
    }
  `,
}

Utils.toTimeString = (str: string) => {
  const d = new Date(parseInt(str, 10))
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
}

function Utils() {}

export default Utils
