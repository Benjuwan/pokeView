import { FC, memo } from "react";
import styled from "styled-components";

type btnType = {
    btnTxt: string;
    classNameTxt: string;
    disabledBool?: boolean;
    ClickEvent: () => void;
}

export const BtnComponent: FC<btnType> = memo((props) => {
    const { btnTxt, classNameTxt = 'default', ClickEvent, disabledBool } = props;

    return (
        <BtnItem
            type="button"
            disabled={disabledBool}
            className={classNameTxt}
            onClick={ClickEvent}
        >
            {btnTxt}
        </BtnItem>
    );
});

const BtnItem = styled.button`
width: 100%;
appearance: none;
border: 1px solid #333;
background-color: #fff;
border-radius: 4px;
text-align: center;
line-height: 2;

&:not([disabled]){
    cursor: pointer;
    &:hover {
        color: #fff;
        background-color: #333;
        border-color: transparent;
    }
}
`;