export class NumAqlFormattingProvider {
  readonly PRESERVE_SPACE_DELIMITER = ';;;;;'
  readonly SPACE_SEPARATED_KEYWORDS = ['order by']
  readonly AREA_BREAK_WORDS = ['from', 'where', 'select', 'order by']
  readonly LINE_BREAK_WORDS_FOR_CURRENT_LINE = ['contains']
  readonly LINE_BREAK_WORDS_FOR_NEXT_LINE = ['and', 'or']
  readonly LINE_BREAK_WHITE_SPACE_FOLLOWED_CHARS = [',']

  readonly TAB_SIZE = 2
  readonly ADD_NEW_LINE = '\n'
  readonly ADD_SPACE = ' '

  /**
   * returns the amount of spaces specified as the tab size
   */
  private addIndent(): string {
    let result = ''
    for (let index = 0; index < this.TAB_SIZE; index++) {
      result += this.ADD_SPACE
    }
    return result
  }

  /**
   * Method to be used by the monaco editor
   * @param model The monaco editor model
   * @param options The monaco editor formatting options
   * @param token The cancellation token
   */
  format = (
    model: monaco.editor.ITextModel,
    options?: monaco.languages.FormattingOptions,
    token?: monaco.CancellationToken
  ): monaco.languages.ProviderResult<monaco.languages.TextEdit[]> => {
    const query = model.getValue()
    const text = this.formatQuery(query)
    return [
      {
        range: {
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 100_000,
          endColumn: 100_000,
        },
        text,
      },
    ]
  }

  /**
   * Method to be used directly to perform formatting on a string
   * @param query The query string to be formatted
   */
  formatQuery(query: string): string {
    this.SPACE_SEPARATED_KEYWORDS.forEach((keyword) => {
      const pattern = new RegExp(keyword, 'i')
      query = query.replace(pattern, keyword.split(' ').join(this.PRESERVE_SPACE_DELIMITER))
    })

    const queryPartsBefore = query.replace(/\r?\n|\r|\t/g, ' ').split(' ')
    this.trimLeadingWhitespaces(queryPartsBefore)

    let lastWasLineBreak = true
    const queryPartsResult = []

    queryPartsBefore.forEach((word, index) => {
      word = word.split(this.PRESERVE_SPACE_DELIMITER).join(' ')
      const toBeChecked = word.toLowerCase()
      if (this.AREA_BREAK_WORDS.includes(toBeChecked)) {
        this.handleAreaBreak(queryPartsResult, word, index)
        lastWasLineBreak = true
      } else if (this.LINE_BREAK_WORDS_FOR_CURRENT_LINE.includes(toBeChecked)) {
        this.handleLineBreakForCurrent(queryPartsResult, word, lastWasLineBreak)
        lastWasLineBreak = false
      } else if (
        this.LINE_BREAK_WORDS_FOR_NEXT_LINE.includes(toBeChecked) ||
        this.LINE_BREAK_WHITE_SPACE_FOLLOWED_CHARS.includes(word[word.length - 1])
      ) {
        this.handleLineBreakForNext(queryPartsResult, word, lastWasLineBreak)
        lastWasLineBreak = true
      } else if (this.isNoWhitespace(word)) {
        this.handleWord(queryPartsResult, word, lastWasLineBreak)
        lastWasLineBreak = false
      }
    })

    return queryPartsResult.join('')
  }

  /**
   * If its not the first word it adds a new line first and then the word in upper case followed by a new line with indention
   * @param resultArray the array of the resulting query parts
   * @param word the curent word in the itteration
   * @param index the index of the word inside the array of query parts
   */
  private handleAreaBreak(resultArray: string[], word: string, index: number): void {
    if (index !== 0) {
      resultArray.push(this.ADD_NEW_LINE)
    }
    resultArray.push(word.toUpperCase())
    resultArray.push(this.ADD_NEW_LINE)
    resultArray.push(this.addIndent())
  }

  /**
   * If the last part was not a line break it adds a line break and indention first and then the word
   * @param resultArray the array of the resulting query parts
   * @param word the curent word in the itteration
   * @param lastWasLineBreak indicatior if the last part of the result was a line break
   */
  private handleLineBreakForCurrent(
    resultArray: string[],
    word: string,
    lastWasLineBreak: boolean
  ): void {
    if (!lastWasLineBreak) {
      resultArray.push(this.ADD_NEW_LINE)
      resultArray.push(this.addIndent())
    }
    resultArray.push(word)
  }

  /**
   * Adds the word first and then adds a line break and indention. If the last was not a line break it adds a space at the beginning
   * @param resultArray the array of the resulting query parts
   * @param word the curent word in the itteration
   * @param lastWasLineBreak indicatior if the last part of the result was a line break
   */
  private handleLineBreakForNext(
    resultArray: string[],
    word: string,
    lastWasLineBreak: boolean
  ): void {
    if (!lastWasLineBreak) {
      resultArray.push(this.ADD_SPACE)
    }
    resultArray.push(word)
    resultArray.push(this.ADD_NEW_LINE)
    resultArray.push(this.addIndent())
  }

  /**
   * Adds the word to the resulting array and a space before if its not after a line break
   * @param resultArray the array of the resulting query parts
   * @param word the curent word in the itteration
   * @param lastWasLineBreak indicatior if the last part of the result was a line break
   */
  private handleWord(resultArray: string[], word: string, lastWasLineBreak: boolean): void {
    if (!lastWasLineBreak) {
      resultArray.push(this.ADD_SPACE)
    }
    resultArray.push(word)
  }

  /**
   * Checks if the word is just whitespace or not
   * @param toBeChecked word that is supposed to be checked
   */
  private isNoWhitespace(toBeChecked: string): boolean {
    return /\S/.test(toBeChecked)
  }

  /**
   * Trims all leading whitespaces
   * @param queryArray array of words
   */
  private trimLeadingWhitespaces(queryArray: string[]): void {
    if (!this.isNoWhitespace(queryArray[0])) {
      queryArray.splice(0, 1)
      this.trimLeadingWhitespaces(queryArray)
    }
  }
}
