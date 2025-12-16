function getCurrentQuarter(): 1 | 2 | 3 | 4 {
  const month = new Date().getMonth() // 0–11
  return (Math.floor(month / 3) + 1) as 1 | 2 | 3 | 4
}
export { getCurrentQuarter }
