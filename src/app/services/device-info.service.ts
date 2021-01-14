export abstract class DeviceInfoService {
  public isIOSDevice(): boolean {
    return ['iPhone'].includes(navigator.platform) || (navigator.userAgent.includes('Mac') && 'ontouchend' in document);
  }
}
