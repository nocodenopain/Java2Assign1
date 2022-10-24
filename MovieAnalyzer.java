import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

public class MovieAnalyzer {
    List<String[]> cont = new ArrayList<>();
    int length;

  public MovieAnalyzer(String dataset_path) throws IOException {
    FileInputStream fis = new FileInputStream(dataset_path);
    InputStreamReader isr = new InputStreamReader(fis, StandardCharsets.UTF_8);
    BufferedReader br = new BufferedReader(isr);
    br.readLine();
    String line;
    while ((line = br.readLine()) != null) {
            String[] item = line.trim().split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)", -1);
            cont.add(item);
            length++;
        }
    }

    public Map<Integer, Integer> getMovieCountByYear() {
        Map<Integer, Integer> map = new LinkedHashMap<>();
        int[] dic = new int[2050];
        for (String[] strings : cont) {
            if (strings[2] != null) dic[Integer.parseInt(strings[2])]++;
        }
        for (int i = 2049; i >= 0; i--) {
            if (dic[i] != 0) map.put(i, dic[i]);
        }
        return map;
    }

    public Map<String, Integer> getMovieCountByGenre() {
        Map<String, Integer> map = new LinkedHashMap<>();
        Map<String, Integer> tmp = new HashMap<>();
        for (int i = 0; i < length; i++) {
            if (cont.get(i)[5] != null) {
                String s = cont.get(i)[5];
                s = s.replace("\"", "");
                s = s.replace(" ", "");
                String[] genre = s.split(",");
                for (String string : genre) {
                    if (tmp.containsKey(string)) tmp.put(string, tmp.get(string) + 1);
                    else tmp.put(string, 1);
                }
            }
        }
        class tuple implements Comparable {
            final int cnt;
            final String genre;

            public tuple(int cnt, String genre) {
                this.cnt = cnt;
                this.genre = genre;
            }

            @Override
            public int compareTo(Object o) {
                if (o instanceof tuple) {
                    if (this.cnt > ((tuple) o).cnt) return -1;
                    else if (this.cnt < ((tuple) o).cnt) {
                        return 1;
                    } else {
                        return this.genre.compareTo(((tuple) o).genre) > 0 ? 1 : -1;
                    }
                }
                return -1;
            }
        }
        List<tuple> tuples = new ArrayList<>();
        tmp.forEach((key, value) -> tuples.add(new tuple(value, key)));
        tuple[] order = new tuple[21];
        for (int i = 0; i < 21; i++) {
            order[i] = tuples.get(i);
        }
        Arrays.sort(order);
        for (tuple t : order) {
            map.put(t.genre, t.cnt);
        }
        return map;
    }

    public Map<List<String>, Integer> getCoStarCount() {
        class peopleList {
            final List<String> list;

            public peopleList(String s1, String s2) {
                list = new ArrayList<>();
                if (s1.compareTo(s2) < 0) {
                    this.list.add(s1);
                    this.list.add(s2);
                } else {
                    this.list.add(s2);
                    this.list.add(s1);
                }
            }

            @Override
            public boolean equals(Object o) {
                if (this == o) return true;
                if (o instanceof peopleList) {
                    String s1 = list.get(0);
                    String s2 = list.get(1);
                    return s1.equals(((peopleList) o).list.get(0)) && s2.equals(((peopleList) o).list.get(1));
                }
                return false;
            }

            public int hashCode() {
                return Objects.hash(list.get(0), list.get(1));
            }
        }
        Map<peopleList, Integer> map = new HashMap<>();
        for (int i = 0; i < length; i++) {
            for (int j = 10; j < 14; j++) {
                for (int k = j + 1; k < 14; k++) {
                    peopleList tmp = new peopleList(cont.get(i)[j], cont.get(i)[k]);
                    if (map.containsKey(tmp)) map.put(tmp, map.get(tmp) + 1);
                    else map.put(tmp, 1);
                }
            }
        }
        Map<List<String>, Integer> ans = new HashMap<>();
        map.forEach((key, value) -> {
            List<String> s = new ArrayList<>();
            s.add(key.list.get(0));
            s.add(key.list.get(1));
            ans.put(s, value);
        });
        return ans;
    }

    public List<String> getTopMovies(int top_k, String by) {
        List<String> ans = new ArrayList<>();
        class tupleByTime implements Comparable {
            final String name;
            final int year;

            public tupleByTime(String name, int year) {
                this.name = name;
                this.year = year;
            }

            @Override
            public int compareTo(Object o) {
                if (o instanceof tupleByTime) {
                    if (this.year > ((tupleByTime) o).year) return 1;
                    else if (this.year < ((tupleByTime) o).year) return -1;
                    else return ((tupleByTime) o).name.compareTo(this.name);
                }
                return -1;
            }
        }
        class tupleByOver implements Comparable {
            final String name;
            final String overview;

            public tupleByOver(String name, String overview) {
                this.name = name;
                this.overview = overview;
            }

            @Override
            public int compareTo(Object o) {
                if (o instanceof tupleByOver) {
                    if (this.overview.length() > ((tupleByOver) o).overview.length()) return 1;
                    else if (this.overview.length() < ((tupleByOver) o).overview.length()) return -1;
                    else return ((tupleByOver) o).name.compareTo(this.name);
                }
                return -1;
            }
        }
        switch (by) {
            case "runtime" -> {
                PriorityQueue<tupleByTime> bigHeap = new PriorityQueue<>();
                for (int i = 0; i < length; i++) {
                    String s = cont.get(i)[4].replace(" min", "");
                    int tmp = Integer.parseInt(s);
                    bigHeap.add(new tupleByTime(cont.get(i)[1].replace("\"", ""), tmp));
                    if (bigHeap.size() > top_k) bigHeap.remove();
                }
                while (!bigHeap.isEmpty()) {
                    ans.add(bigHeap.remove().name);
                }
                Collections.reverse(ans);
            }
            case "overview" -> {
                Queue<tupleByOver> heap = new PriorityQueue<>();
                for (int i = 0; i < length; i++) {
                    String s = cont.get(i)[7];
                    if (s.charAt(0) == '\"') s = s.substring(1, s.length() - 1);
                    heap.add(new tupleByOver(cont.get(i)[1].replace("\"", ""), s));
                    if (heap.size() > top_k) heap.remove();
                }
                while (!heap.isEmpty()) {
                    ans.add(heap.remove().name);
                }
                Collections.reverse(ans);
            }
            default -> throw new IllegalStateException("Unexpected value: " + by);
        }
        return ans;
    }

    public List<String> getTopStars(int top_k, String by) {
        List<String> ans = new ArrayList<>();
        class tupleByRate implements Comparable {
            final String name;
            int cnt;
            double score;
            double average;

            public tupleByRate(String name) {
                this.name = name;
            }

            public void addMovie(float score) {
                cnt++;
                this.score += score;
                average = (this.score / cnt);
            }

            @Override
            public int compareTo(Object o) {
                if (o instanceof tupleByRate) {
                    String a = String.valueOf(this.average);
                    String b = String.valueOf(((tupleByRate) o).average);
                    if (a.equals(b)) return ((tupleByRate) o).name.compareTo(this.name);
                    else if (this.average > ((tupleByRate) o).average) return 1;
                    else return -1;
                }
                return -1;
            }

            @Override
            public boolean equals(Object obj) {
                if (obj instanceof tupleByRate) {
                    return Objects.equals(this.name, ((tupleByRate) obj).name);
                }
                return false;
            }

            public int hashCode() {
                return Objects.hash(this.name);
            }
        }
        List<tupleByRate> tuples = new ArrayList<>();
        switch (by) {
            case "rating" -> {
                Map<String, tupleByRate> map = new HashMap<>();
                for (int i = 0; i < length; i++) {
                    for (int j = 10; j < 14; j++) {
                        String name = cont.get(i)[j];
                        float score = Float.parseFloat(cont.get(i)[6]);
                        tupleByRate tmp;
                        if (map.containsKey(name)) {
                            tmp = map.get(name);
                            tmp.addMovie(score);
                        } else {
                            tmp = new tupleByRate(name);
                            tmp.addMovie(score);
                        }
                        map.put(name, tmp);
                    }
                }
                map.forEach((key, value) -> tuples.add(value));
                tupleByRate[] tuple = new tupleByRate[tuples.size()];
                for (int i = 0; i < tuple.length; i++) {
                    tuple[i] = tuples.get(i);
                }
                Arrays.sort(tuple);
                for (int i = tuple.length - 1; i >= tuple.length - top_k; i--) {
                    ans.add(tuple[i].name);
                }
            }
            case "gross" -> {
                Map<String, tupleByRate> map = new HashMap<>();
                for (int i = 0; i < length; i++) {
                    for (int j = 10; j < 14; j++) {
                        String name = cont.get(i)[j];
                        if (cont.get(i)[15] != null && !cont.get(i)[15].equals("")) {
                            float score = Float.parseFloat(cont.get(i)[15].replace(",", "").replace("\"", ""));
                            tupleByRate tmp;
                            if (map.containsKey(name)) {
                                tmp = map.get(name);
                                tmp.addMovie(score);
                            } else {
                                tmp = new tupleByRate(name);
                                tmp.addMovie(score);
                            }
                            map.put(name, tmp);
                        }
                    }
                }
                map.forEach((key, value) -> tuples.add(value));
                tupleByRate[] tuple = new tupleByRate[tuples.size()];
                for (int i = 0; i < tuple.length; i++) {
                    tuple[i] = tuples.get(i);
                }
                Arrays.sort(tuple);
                for (int i = tuple.length - 1; i >= tuple.length - top_k; i--) {
                    ans.add(tuple[i].name);
                }
            }
        }
        return ans;
    }

    public List<String> searchMovies(String genre, float min_rating, int max_runtime) {
        List<String> tmp = new ArrayList<>();
        for (String[] string : cont) {
            String[] s = string[5].replace("\"", "").replace(" ", "").split(",");
            for (String s1 : s) {
                if (s1.equals(genre) && Float.parseFloat(string[6]) >= min_rating && Integer.parseInt(string[4].replace(" min", "")) <= max_runtime) {
                    String title = string[1];
                    if (title.charAt(0) == '\"') tmp.add(title.substring(1, title.length() - 1));
                    else tmp.add(title);
                }
            }
        }
        String[] ansWithoutOrder = new String[tmp.size()];
        for (int i = 0; i < tmp.size(); i++) {
            ansWithoutOrder[i] = tmp.get(i);
        }
        Arrays.sort(ansWithoutOrder);
        return new ArrayList<>(Arrays.asList(ansWithoutOrder).subList(0, tmp.size()));
    }


}

