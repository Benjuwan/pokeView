export const useCurrPagerSelect = () => {
    /* data-current が付いているリストから属性を取り除いて、そのリスト要素の class名を返す */
    const _hasAttrElmRemoveAttr_backToElmClassName: (
        targetEls: NodeListOf<HTMLElement>,
        targetAttr: string
    ) => (string | undefined)[] = (
        targetEls: NodeListOf<HTMLElement>,
        targetAttr: string
    ) => {
            return Array.from(targetEls).map(targetElm => {
                if (targetElm.hasAttribute(targetAttr)) {
                    targetElm.removeAttribute(targetAttr);
                    targetElm.classList.remove('afterRender'); // 先頭要素に付与した初期表示時の調整用 class を削除
                    return targetElm.className;
                }
            }).filter(targetElm => targetElm !== undefined);
        }

    /* 別のリストのクリック直前までに選択されていた（data-current === true）リストのインデックス番号を取得する */
    const _getTargetElmIndexNum: (
        targetEls: NodeListOf<HTMLElement>,
        prevCurrentElm: string | undefined
    ) => (number | undefined)[] = (
        targetEls: NodeListOf<HTMLElement>,
        prevCurrentElm: string | undefined
    ) => {
            return Array.from(targetEls).map((targetElm, i) => {
                if (targetElm.className === prevCurrentElm) {
                    // console.log(targetElm, i);
                    return i;
                }
            }).filter(targetElm => targetElm !== undefined);
        }

    /* リストアニメーションに関する class 名の付与・解除 */
    const _resetAlreadyClassName_addTargetClassName: (
        targetEls: NodeListOf<HTMLElement>,
        targetElm: HTMLElement,
        targetClassName: string
    ) => void = (
        targetEls: NodeListOf<HTMLElement>,
        targetElm: HTMLElement,
        targetClassName: string
    ) => {
            targetEls.forEach(targetEl => {
                if (
                    targetEl.classList.contains('prev') ||
                    targetEl.classList.contains('next')
                ) {
                    targetEl.classList.remove('prev');
                    targetEl.classList.remove('next');
                }
            });
            targetElm.classList.add(targetClassName);
        }

    /*【State 依存無し】ページャー項目をクリック時に現在ページのシグナル（data-pager = true, 該当する className）をクリックしたページャー項目へ移行 */
    const CurrPagerSelect: (
        btnElm: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        pagerIndex: number
    ) => void = (
        btnElm: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        pagerIndex: number
    ) => {
            const pagerEls: NodeListOf<HTMLElement> = document.querySelectorAll('[data-pager]');

            /* data-current が付いているリストから属性を取り除いて、そのリスト要素の class名を返す */
            const prevCurrentElm = _hasAttrElmRemoveAttr_backToElmClassName(pagerEls, 'data-current');

            /* 別のリストのクリック直前までに選択されていた（data-current === true）リストのインデックス番号を取得する */
            const prevCurrentElmIndex = _getTargetElmIndexNum(pagerEls, prevCurrentElm[0]);

            btnElm.currentTarget.setAttribute('data-current', 'true'); // クリックしたリスト要素に data-current を付与
            // console.log(prevCurrentElm[0], prevCurrentElmIndex[0], i);

            /* インデックス番号の前後に応じて付与する class を区別 */
            if (typeof prevCurrentElmIndex[0] !== "undefined") {
                if (pagerIndex < prevCurrentElmIndex[0]) {
                    _resetAlreadyClassName_addTargetClassName(pagerEls, btnElm.currentTarget, 'prev');
                } else {
                    _resetAlreadyClassName_addTargetClassName(pagerEls, btnElm.currentTarget, 'next');
                }
            }
        }

    /*【State 依存有り】isCurrPage State を依存配列に指定して使用し、当該 State が更新される度に以下の処理を行う。※「前のページ」「次のページ」クリック時にもシグナル移行を実現するための専用メソッド */
    const CheckCurrPager: (isCurrPage: number) => void = (isCurrPage: number) => {
        const pagerEls: NodeListOf<HTMLElement> = document.querySelectorAll('[data-pager]');

        /* data-current が付いているリストから属性を取り除いて、そのリスト要素の class名を返す */
        const prevCurrentElm = _hasAttrElmRemoveAttr_backToElmClassName(pagerEls, 'data-current');

        /* 別のリストのクリック直前までに選択されていた（data-current === true）リストのインデックス番号を取得する */
        const prevCurrentElmIndex = _getTargetElmIndexNum(pagerEls, prevCurrentElm[0]);

        pagerEls.forEach((pagerEl, pagerIndex) => {
            /* isCurrPage の数値と合致するページャー項目に現在ページのシグナル（data-pager = true, 該当する className）を付与 */
            if (String(isCurrPage) === pagerEl.textContent) {
                pagerEl.setAttribute('data-current', 'true');

                /* インデックス番号の前後に応じて付与する class を区別 */
                if (typeof prevCurrentElmIndex[0] !== "undefined") {
                    if (pagerIndex < prevCurrentElmIndex[0]) {
                        _resetAlreadyClassName_addTargetClassName(pagerEls, pagerEl, 'prev');
                    } else {
                        _resetAlreadyClassName_addTargetClassName(pagerEls, pagerEl, 'next');
                    }
                }
            }
        });
    }

    return { CurrPagerSelect, CheckCurrPager }
}

/**【CSS】
 * .pagerLists{
        position: relative;
        // z-index: 1;

        &[data-current="true"]{
            color: #fff;
            
            &::before {
                background-color: #333;
                /* data-current が付いているものはスタイルを正す *
                transform: scaleY(1) translateX(0%); 
            }
        }
        
        &::before {
            display: block;
            content: "";
            width: 100%;
            height: 100%;
            border-radius: 8px;
            position: absolute;
            z-index: -1;
            margin: auto;
            inset: 0;
            /* 縮小 → 拡大を実現するため scaleY(.75) で縦を縮めておく *
            transform: scaleY(.75) translateX(0%);
        }
        
        &.prev{
            &::before{
                left: 50%;
                /* 縮小 → 拡大を実現するため scaleY(1) *
                transform: scaleY(1) translateX(-50%);
                transition: transform .5s;
            }
        }
        
        &.next{
            &::before{
                left: auto;
                right: 50%;
                /* 縮小 → 拡大を実現するため scaleY(1) *
                transform: scaleY(1) translateX(50%);
                transition: transform .5s;
            }
        }
    }
 */