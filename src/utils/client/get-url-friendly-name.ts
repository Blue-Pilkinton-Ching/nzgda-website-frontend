export default function getURLFriendlyName(name: string) {
  return name.trim().replace(/\s+/g, '-').toLowerCase()
}
