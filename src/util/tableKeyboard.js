export  const handleTableKeydown = (event) => {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        return
    }

    const current = event.target

    if (!current.matches('input, textarea, select')) {
        return
    }

    const currentTd = current.closest('td')
    const currentTr = current.closest('tr')

    if (!currentTd || !currentTr) {
        return
    }

    const tbody = currentTr.closest('tbody')

    if (!tbody) {
        return
    }

    const rows = Array.from(tbody.querySelectorAll(':scope > tr'))
    const cells = Array.from(currentTr.children)

    const rowIndex = rows.indexOf(currentTr)
    const colIndex = cells.indexOf(currentTd)

    let nextRowIndex = rowIndex
    let nextColIndex = colIndex

    if (event.key === 'ArrowUp') {
        nextRowIndex--
    }

    if (event.key === 'ArrowDown') {
        nextRowIndex++
    }

    if (event.key === 'ArrowLeft') {
        nextColIndex--
    }

    if (event.key === 'ArrowRight') {
        nextColIndex++
    }

    if (
        nextRowIndex < 0 ||
        nextRowIndex >= rows.length ||
        nextColIndex < 0
    ) {
        return
    }

    const nextRow = rows[nextRowIndex]

    if (!nextRow) {
        return
    }

    const nextCells = Array.from(nextRow.children)
    const nextCell = nextCells[nextColIndex]

    if (!nextCell) {
        return
    }

    const nextInput = nextCell.querySelector(
        'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )

    if (!nextInput) {
        return
    }

    event.preventDefault()

    nextInput.focus()

    if (nextInput.select) {
        nextInput.select()
    }
}
