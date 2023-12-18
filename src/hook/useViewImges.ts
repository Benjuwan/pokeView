export const useViewImges = () => {
    const ViewImges: (imgEl: HTMLDivElement) => void = (imgEl: HTMLDivElement) => {
        if (!imgEl.classList.contains('OnView')) {
            imgEl.classList.add('OnView');
        } else {
            imgEl.classList.remove('OnView');
        }
    }

    return { ViewImges }
}