declare module "react-native-bluetooth-escpos-printer" {
  export default class BluetoothEscposPrinter {
    static connect(address: string): Promise<void>;
    static printText(text: string): Promise<void>;
    static cut(): Promise<void>;
    static disconnect(): Promise<void>;
    static getStatus(): Promise<void>;
  }
}
