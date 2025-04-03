import { FC, memo } from "react";

type btnType = {
    btnTxt: string;
    classNameTxt: string;
    disabledBool?: boolean;
    ClickEvent: () => void;
}

export const BtnComponent: FC<btnType> = memo((props) => {
    const { btnTxt, classNameTxt = 'default', ClickEvent, disabledBool } = props;

    return (
        <button
            type="button"
            disabled={disabledBool}
            className={`${classNameTxt} w-full appearance-none border border-[#333] bg-[#fff] rounded text-center leading-[2] disabled:bg-[#dadada] disabled:text-[#a8a8a8] not-disabled:cursor-pointer not-disabled:hover:text-[#fff] not-disabled:hover:bg-[#333] not-disabled:hover:border-transparent`}
            onClick={ClickEvent}
        >
            {btnTxt}
        </button>
    );
});