<!-- ```bash
- `main`
  - `doc`
  - `release`
    - `feature/<feature-name>`
    - `feature/<feature-name>`
      - `feature/<feature-name>-<developer-name>`
    - `feature/<feature-name>`
```

- 推荐使用github desktop处理git
  - 如果在vscode内使用,推荐gitlens插件
  - 可以使用sourcetree来处理
  - 选择其一即可，优先github desktop, 有给初学者最人性化的引导
  - 除了github desktop的其他工具通常功能更多，比如可视化查看分支的情况。但是bug也可能会更多
- main 分支长期保持稳定,只有每次业务完全开发完成,需要阶段性交付时才从release合并
  - main 只能从 doc 或者 release合并. doc不能涉及代码
- release 分支仅合并`fe/main`和`be/main`, 特殊情况新建`temp/<description>`分支然后合并
- 代码随时可以从主干流向分支, 自行拉取
- 代码定期从分支逐级合并到主干, 需要code review
- main和release 都不能直接写, 只能从分支合并, 如果有不属于现有任何分支的情况,需要先创建一个temp分支在本地, 处理好后分支上传到云端,然后发起pull request -->
<!-- - test restrict -->
