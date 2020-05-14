var innerValue = 'innerValue'

setTimeout(() => {
    innerValue = 'innerValue has been changed'
}, 100)

function changeInnverValue () {
    innerValue = 'innerValue has been changed by function'
}

function changeInnverValueInnerFunction () {
    innerValue = 'innerValue has been changed by inner function'
}

module.exports = {
    innerValue,
    changeInnverValue
}

changeInnverValueInnerFunction()

console.log(innerValue)