export interface StockAddDto {
    name: string;
    count: number;
    isActive: boolean;
    deviceType: DeviceType;

}
export enum DeviceType {

    Printer,
    Server,
    Client,
    Software
}