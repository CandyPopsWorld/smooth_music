function LocalizationSelect({elements_option, updateLocalization, style = {backgroundColor: 'rgb(14, 15, 15)', border: '1px solid white', color: 'white'}}) {
    return (
        <select id='localization' name='localization' onChange={updateLocalization} style={style}>
            {elements_option}
        </select>
    );
}

export default LocalizationSelect;