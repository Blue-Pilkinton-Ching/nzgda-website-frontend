export default function encodeObjtoURI(object: { [x: string]: any }): string {
  let value = ''

  Object.keys(object).forEach((element) => {
    if (object[element]) {
      value += `${element}=${encodeURIComponent(object[element])}&`
    }
  })

  return value
}
