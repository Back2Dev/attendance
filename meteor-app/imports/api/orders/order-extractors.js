const toCents = amount => parseInt(Math.round(100 * parseFloat(amount)))

export default extractors = {
  bpw: [
    { regex: /^Order Number:\s+(\w+)/, target: 'orderNumber' },
    { regex: /^Date Ordered:\s+(.+)$/, target: 'dateOrdered' },
    { regex: /^Sub-Total:\s+[$]*(.*)$/, target: 'subTotal', type: 'cents' },
    { regex: /^GST:\s+\$(.*)$/, target: 'gst', type: 'cents' },
    { regex: /^Total:\s+\$(.*)$/, target: 'totalPrice', type: 'cents' },
    { regex: /^Purchase Order No:\s+(.*)$/, target: 'poNo' },
    // Parts extractor
    //1 x BRAKE SHOES  V Brake Shoes, 70mm, BLACK (25 Pairs Per Box) (1585BULK) = $72.70
    {
      regex: /^(\d+) x (.*?) \((\w+)\) = \$(.*)$/,
      target: 'parts',
      unpacker: (acc, match) => {
        acc.push({
          qty: parseInt(match[1]),
          name: match[2],
          partNo: match[3],
          price: Math.round(toCents(match[4]) / parseInt(match[1])),
          // TODO: Make this real
          addedAt: new Date()
        })
      }
    }
  ],
  ktw: [
    { regex: /^Order Number:\s+(\w+)/, target: 'orderNumber' },
    { regex: /^Date Ordered:\s+(.+)$/, target: 'dateOrdered' },
    { regex: /^Sub-Total:\s+[$]*(.*)$/, target: 'subTotal', type: 'cents' },
    { regex: /^GST:\s+\$(.*)$/, target: 'gst', type: 'cents' },
    { regex: /^Total:\s+\$(.*)$/, target: 'totalPrice', type: 'cents' },
    { regex: /^Purchase Order No:\s+(.*)$/, target: 'poNo' },
    // Parts extractor
    //1 x BRAKE SHOES  V Brake Shoes, 70mm, BLACK (25 Pairs Per Box) (1585BULK) = $72.70
    {
      regex: /^(\d+) x (.*?) \((\w+)\) = \$(.*)$/,
      target: 'parts',
      unpacker: (acc, match) => {
        acc.push({
          qty: parseInt(match[1]),
          name: match[2],
          partNo: match[3],
          price: Math.round(toCents(match[4]) / parseInt(match[1])),
          // TODO: Make this real
          addedAt: new Date()
        })
      }
    }
  ]
}
