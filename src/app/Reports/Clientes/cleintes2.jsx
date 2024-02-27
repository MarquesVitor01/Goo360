import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
function clientesPDF2(clientes){
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const reportTitle =[
        {
            text: 'Situação dos clientes',
            FontSize: 15,
            bold: true,
            margin: [50, 20, 20, 50]
        }
    ];
    const dados = clientes.map((cliente) => {
        return [
            {text: cliente.cpf, FontSize: 3, margin: [0, 2, 0, 2]},
            {text: cliente.nome, FontSize: 3,  margin: [0, 2, 0, 2]},
            {text: cliente.email, FontSize: 3,  margin: [0, 2, 0, 2]},
            {text: cliente.uf, FontSize: 3,  margin: [0, 2, 0, 2]},
            {text: cliente.fone, FontSize: 3 ,  margin: [0, 2, 0, 2]},
            {text: cliente.valor, FontSize: 3,  margin: [0, 2, 0, 2]},
            {text: 'Sim', FontSize: 3,  margin: [0, 2, 0, 2]},
        ]
    })
    const details =[
        {
            table: {
                headerRows: 1,
                widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                body: [
                    [
                        {text: 'CNPJ/CPF', style: 'tableHeader', FontSize: 4, bold: true, color: 'red'},
                        {text: 'Nome', style: 'tableHeader', FontSize: 4, bold: true, color: 'red'},
                        {text: 'E-mail', style: 'tableHeader', FontSize: 4, bold: true, color: 'red'},
                        {text: 'Uf', style: 'tableHeader', FontSize: 4, bold: true, color: 'red'},
                        {text: 'Telefone', style: 'tableHeader', FontSize: 4, bold: true, color: 'red'},
                        {text: 'Valor', style: 'tableHeader', FontSize: 4, bold: true, color: 'red'},
                        {text: 'Pago', style: 'tableHeader', FontSize: 4, bold: true, color: 'red'}
                    ],
                    ...dados 
                ]
            },
            layout: 'ligthHorizontalLines'
        }
    ];
    function Rodape(currentPage, pageCount){
        return [
            {
                text: currentPage + '/' + pageCount,
                alignment: 'right',
                FontSize: 9,
                margin: [0, 10, 20, 0] 
            }
        ]
    }
    const docDefinitions = {
        pagesSize: 'A4',
        pagesMargins: [15, 50, 15, 40],

        header: [reportTitle],
        content: [details],
        footer: Rodape
    }
    pdfMake.createPdf(docDefinitions).download();
}
export default clientesPDF2;