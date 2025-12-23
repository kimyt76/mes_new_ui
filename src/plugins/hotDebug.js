import Handsontable from 'handsontable'

function shortStack(lines = 14) {
  const s = new Error().stack || ''
  return s.split('\n').slice(0, lines).join('\n')
}

export function enableHotDebug() {
  if (Handsontable.__hotDebugEnabled) return
  Handsontable.__hotDebugEnabled = true

  const Core = Handsontable.Core
  if (!Core?.prototype) {
    console.warn('[HOT DEBUG] Core prototype not found')
    return
  }

  // ✅ destroy 로깅
  const origDestroy = Core.prototype.destroy
  if (typeof origDestroy === 'function' && !Core.prototype.__hotDestroyWrapped) {
    Core.prototype.destroy = function (...args) {
      console.log(
        '%c[HOT DESTROY]',
        'color:#ef4444;font-weight:bold;',
        this.__debugId,
        '\ncreate:\n',
        this.__createStack || '(no create stack)',
        '\ndestroy call stack:\n',
        shortStack(10),
      )
      return origDestroy.apply(this, args)
    }
    Core.prototype.__hotDestroyWrapped = true
  }

  // ✅ getSettings 로깅 + 에러 삼키기(원인 추적용)
  const origGetSettings = Core.prototype.getSettings
  if (typeof origGetSettings === 'function' && !Core.prototype.__hotGetSettingsWrapped) {
    Core.prototype.getSettings = function (...args) {
      try {
        return origGetSettings.apply(this, args)
      } catch (e) {
        const msg = String(e?.message || e || '')
        if (msg.includes('getSettings') && msg.includes('destroyed')) {
          console.warn(
            '%c[HOT getSettings AFTER DESTROY]',
            'color:#f59e0b;font-weight:bold;',
            this.__debugId,
            '\ncreate:\n',
            this.__createStack || '(no create stack)',
            '\nerror:\n',
            msg,
            '\ncall stack:\n',
            shortStack(12),
          )
          // ✅ 여기서 빈 settings 반환하면 콘솔 에러 자체도 사라짐
          return {}
        }
        throw e
      }
    }
    Core.prototype.__hotGetSettingsWrapped = true
  }

  console.log('%c[HOT DEBUG ENABLED]', 'color:#3b82f6;font-weight:bold;')
}
