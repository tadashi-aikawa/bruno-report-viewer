import "vue";

declare module "vue" {
  // for vue components
  interface AllowedComponentProps {
    // inputにフォールスルー属性として利用
    type?: unknown;
    // LargeInput以外の箇所でフォールスルー属性として利用と仮定
    placeholder?: unknown;
    // @changeのフォールスルー属性
    onChange?: unknown;
    // @clickのフォールスルー属性
    onClick?: unknown;

    [key: `data${Capitalize<string>}`]: string;
    // TODO: フォールスルー属性が増えたら追加していく

    readonly?: boolean;
    disabled?: boolean;
  }

  // for native html elements
  interface HTMLAttributes {
    // allow any data-* attr
    [key: `data-${string}`]: string;
  }
}

export {};
