module.exports = function(api) {
  if (api) {
    api.cache(true)
    api.debug = process.env.NODE_ENV === 'devolepment' || false
  }

  const presets = ['@babel/preset-env']
 
  return {
    presets
  }
}
