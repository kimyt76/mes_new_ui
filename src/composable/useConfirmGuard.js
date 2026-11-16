import { useConfirm } from 'primevue/useconfirm'

export const useConfirmGuard = () => {
    const confirm = useConfirm()

    const confirmGuard = (options) => {
        return new Promise((resolve) => {
            let settled = false

            const finish = (result) => {
                if (settled) return
                settled = true
                resolve(result)
            }

            confirm.require({
                ...options,
                accept: () => finish(true),
                reject: () => finish(false),
                onHide: () => finish(false)
            })
        })
    }

    return { confirmGuard }
}
