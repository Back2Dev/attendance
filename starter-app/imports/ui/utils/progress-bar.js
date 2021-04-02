import React from "react"
import PropTypes from "prop-types"
import CONSTANTS from "/imports/api/constants"

/**
 * Progress Bar
 *
 * @param {integer} { count = 0 } Total surveys
 * @param {array} { statuses=[] } Array of statuses indexed by CONSTANTS.SURVEY_STATUS.ALLOWED_VALUES
 */

const getPerc = (count, num) => {
  return num ? (100 / count) * num : 0
}

export default function ProgressBar({ term }) {
  if (!term || !term.statuses) return <span>Invalid props</span>
  // Prevent breakages if count and total of statuses dont marry up
  // if count data is zero / incorrect, resurrect by summing up total of status counts
  const statusTotal = term.statuses.reduce((a, b) => a + b, 0)
  const count = (term.count === statusTotal) ? term.count : statusTotal
  const height = 20
  const width = 100
  const fontSize = 10
  
  // deconstruct term status array
  const [pending, active, complete, cancelled] = term.statuses
  
  // calculate the values
  const VALS = {
    PENDING: getPerc(count, pending),
    ACTIVE: getPerc(count, active),
    COMPLETE: getPerc(count, complete),
    CANCELLED: getPerc(count, cancelled),
  }
  const COLORS = CONSTANTS.SURVEY_STATUS_COLORS

  const showTick = VALS.COMPLETE === 100

  function label(offset, text, showTick) {
    return (
      <g>
        <text
          textAnchor="middle"
          fontFamily="Lato-Regular, Lato"
          fontSize={fontSize}
          fill={COLORS.LABELS}
          x={offset}
          y={13}
        >
          {text > 0 && !showTick && text}
        </text>
        {text > 0 && showTick && (
          <g fill={COLORS.LABELS} transform={`translate(${offset - 6.5 } ${fontSize / 2})`}>
            <polygon
              points="1.5 4.5 0 6 4 10 13 1.5 11.5 0 4 7"
            />
          </g>
        )}
      </g>
    )
  }

  return (
    <svg style={{ maxWidth: "120px" }} viewBox={`0 0 ${width} ${height}`}>
      <rect
        x="0"
        y="0"
        width={VALS.PENDING}
        height={height}
        fill={COLORS[CONSTANTS.SURVEY_STATUS.PENDING]}
      />
      <rect
        x={VALS.PENDING}
        y="0"
        width={VALS.ACTIVE}
        height={height}
        fill={COLORS[CONSTANTS.SURVEY_STATUS.ACTIVE]}
      />
      <rect
        x={VALS.PENDING + VALS.ACTIVE}
        y="0"
        width={VALS.COMPLETE}
        height={height}
        fill={COLORS[CONSTANTS.SURVEY_STATUS.COMPLETE]}
      />
      <rect
        x={VALS.PENDING + VALS.ACTIVE + VALS.COMPLETE}
        y="0"
        width={VALS.CANCELLED}
        height={height}
        fill={COLORS[CONSTANTS.SURVEY_STATUS.CANCELLED]}
      />
      {label(VALS.PENDING / 2, pending, showTick)}
      {label(VALS.PENDING + VALS.ACTIVE / 2, active, showTick)}
      {label(VALS.PENDING + VALS.ACTIVE + VALS.COMPLETE / 2, complete, showTick)}
      {label(
        VALS.PENDING + VALS.ACTIVE + VALS.COMPLETE + VALS.CANCELLED / 2,
        cancelled, 
        showTick)}
    </svg>
  )
}

ProgressBar.propTypes = {
  term: PropTypes.shape({
    count: PropTypes.number,
    statuses: PropTypes.array,
  }),
}
