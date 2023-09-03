import axios from "axios";

const url = `${import.meta.env.VITE_API_BACK_URL}/sendTrackingCode`;

class trackingCodeService {
  static sendTrackingCode(mail, trackingCode) {
    axios.post(url, { mail, trackingCode });
  }
}

export default trackingCodeService;
