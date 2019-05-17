export default {
  omit: (obj: Object, fields: any[]) => {
    return Object.entries(obj).reduce((r, [k, v]) => {
      if (!fields.includes(k)) r[k] = v
      return r
    }, {})
  },
  pick: (obj: Object, fields: any[]) => {
    return Object.entries(obj).reduce((r, [k, v]) => {
      if (fields.includes(k)) r[k] = v
      return r
    }, {})
  }
}
