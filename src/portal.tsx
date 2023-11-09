/**
 * base on https://github.com/react-component/portal
 */

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getScrollBarSize } from './getScrollBarSize';

let uuid = 1;

let container = document.head || document.body;

export interface PortalProps {
    debug?: string;
    open?: boolean;
    lockScroll?: boolean;
    children?: JSX.Element;
}

export class Portal extends React.Component<PortalProps> {

    readonly style: HTMLStyleElement = document.createElement('style');

    componentDidMount() {
        this.style.setAttribute('panosen-rc-portal', uuid++ + '');
    }

    componentDidUpdate() {
        const isOverflowing = document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && window.innerWidth > document.body.offsetWidth;
        if (isOverflowing && this.props.open && this.props.lockScroll) {
            let scrollbarSize = getScrollBarSize();
            this.style.innerHTML = `html body { overflow-y: hidden; width: calc(100% - ${scrollbarSize}px); }`;
            container.append(this.style);
        } else {
            this.style.remove();
        }
    }

    render(): React.ReactNode {
        if (!this.props.open) {
            return <></>;
        }
        let dom = <div data-debug={this.props.debug}>
            {this.props.children}
        </div>
        return createPortal(dom, document.body);
    }
}
