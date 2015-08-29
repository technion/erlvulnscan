/**
 * This file is provided by Facebook for testing and evaluation purposes
 * only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
 * AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

// HACK: to provide a NodeJS react module. Basically, we copy
// flow's React typing over here.
declare module react {
    declare var Children: any;
    declare var DOM: any;
    declare var PropTypes: any;

    declare function initializeTouchEvents(shouldUseTouch: boolean): void;

    declare function createClass(spec: any): ReactClass<any,any,any>; // compiler magic

    //declare function createElement(name: string, props?: any, children?: any): any;
    declare function createElement<A,P,S>(name: ReactClass<A,P,S>, props: A, children?: any): ReactElement<A,P,S>;

    declare function createFactory(name: string): (props?: any, children?: any) => any;
    declare function createFactory<A,P,S>(name: ReactClass<A,P,S>): (props: A, children?: any) => ReactElement<A,P,S>;

    declare function constructAndRenderComponent(name: string, props: any, container: any): any;
    declare function constructAndRenderComponent<A,P,S>(name: ReactClass<A,P,S>, props: A, container: any): ReactComponent<A,P,S>;

    declare function constructAndRenderComponentByID(name: string, props: any, id: string): any;
    declare function constructAndRenderComponentByID<A,P,S>(name: ReactClass<A,P,S>, props: A, id: string): ReactComponent<A,P,S>;

    declare function render<A,P,S>(element: ReactElement<A,P,S>, container: any): ReactComponent<A,P,S>;

    declare function renderToString(element: ReactElement<any,any,any>): string;
    declare function renderToStaticMarkup(element: ReactElement<any,any,any>): string;

    declare function unmountComponentAtNode(container: any): boolean;

    declare function isValidElement(element: any): boolean;
    declare function withContext(context: any, callback: () => void): any;
};
