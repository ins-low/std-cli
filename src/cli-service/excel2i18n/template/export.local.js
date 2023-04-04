
const { pickSheet } = require('excel-i18n');
async function loadI18n() {
  // 保证多语言部分x和title的x对应，y和key的y对应
  pickSheet({
    inputPath: "./i18n.xlsx", // process.pwd下路径
    outputDir: "./locale", // process.pwd下路径
    extension: ".js",
    sheetName: "宝箱",
    keyX: "A", // key列序号
    keyY1: 3, // key列开头行号,从1开始
    keyY2: 867, // key列结束行号,从1开始
    titleX: ["D", "E","F"], // title 在哪些列
    titleY: 1, // title在哪一行,从1开始
  handleTitle: (position, content) => {
      console.log(position,content)
        if (content && content.split("/")[1]) return content.split("/")[1];
        console.log(content, "标题不合规范");
        process.exit();
    },
    handleContent(position, content) {
        // if (
        //     position === "D10" &&
        //     (!content ||
        //         !content.includes("{nickname}") ||
        //         !content.includes("{cash}"))
        // ) {
        //     console.log(content, "占位符错误");
        //     process.exit();
        // }
        return content;
    },
  });
}
loadI18n()
