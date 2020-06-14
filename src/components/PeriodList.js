import React from "react"
/**
 * Component to iterate over the data and display both the number of elements and the date based on the grouping done
 * on gatsby-node.js
 * @param {Object} postsByPeriod this prop contains a object with the data grouped by year and month
 * 
 */
const PeriodList = ({ postsByPeriod }) => {
  return (
    <div>
      <h2>Items</h2>
      {Object.keys(postsByPeriod).map(item => (
        <div>
          <h3>
            {item} ({postsByPeriod[item].length})
          </h3>
          <p></p>
        </div>
      ))}
    </div>
  )
}

export default PeriodList
