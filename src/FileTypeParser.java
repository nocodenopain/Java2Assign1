import java.io.FileInputStream;

public class FileTypeParser {
    public static void main(String[] args) {
        for (int i = 1; i < 4; i++) {
            String tmp = bytesToHexString(String.valueOf(i));
            assert tmp != null;
            if (tmp.equals("CAFEBABE")) System.out.println(tmp + " " + "class");
            if (tmp.equals("89504E47")) System.out.println(tmp + " " + "png");
            if (tmp.equals("504B0304")) System.out.println(tmp + " " + "zip or jar");
        }
    }

    public static String bytesToHexString(String path) {
        StringBuilder stringBuilder = new StringBuilder();
        FileInputStream is;
        try {
            is = new FileInputStream(path);
            byte[] b = new byte[4];//大小不同，获取的文件头长度也不一样
            is.read(b, 0, b.length);
            if (b == null || b.length <= 0) {
                return null;
            }
            for (int i = 0; i < b.length; i++) {
                int v = b[i] & 0xFF;
                String hv = Integer.toHexString(v);
                if (hv.length() < 2) {
                    stringBuilder.append(0);
                }
                stringBuilder.append(hv);
            }
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return stringBuilder.toString().toUpperCase();
    }
}
