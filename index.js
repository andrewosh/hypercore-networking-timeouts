module.exports = function setNetworkingTimeouts (networker, core) {
  const discoveryKey = core.discoveryKey
  const timeouts = {
    get: (cb) => {
      if (networker.joined(discoveryKey)) {
        if (networker.flushed(discoveryKey)) return cb()
        return flushSet.add(cb)
      }
      if (globalFlushed) return cb()
      return flushSet.add(cb)
    },
    update: (cb) => {
      const oldCb = cb
      cb = (...args) => {
        oldCb(...args)
      }
      if (core.peers.length) return cb()
      if (networker.joined(discoveryKey)) {
        if (networker.flushed(discoveryKey) && !core.peers.length) return cb()
        return peerAddSet.add(cb)
      }
      if (globalFlushed) return cb()
      return peerAddSet.add(cb)
    }
  }
  core.timeouts = timeouts
}
