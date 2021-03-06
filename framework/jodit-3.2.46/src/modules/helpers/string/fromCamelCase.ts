/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

/**
 *
 * @param key
 * @return {string}
 */
export const fromCamelCase = (key: string): string => {
    return key.replace(/([A-Z]+)/g, (m, letter) => {
        return '-' + letter.toLowerCase();
    });
};
